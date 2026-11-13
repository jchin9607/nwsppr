import process from "node:process";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import OpenAI from "openai";
import sanitizeHtml from "sanitize-html";

export default async function publish(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }
  const token = /^Bearer (\S+)$/.exec(req.headers.authorization ?? "")?.[1];
  if (!token) return res.status(401).end();

  const { id, title, description, cover, tags, content } = req.body ?? {};
  if (
    typeof id !== "string" || !id || id.length > 1000 || /[/]/.test(id) ||
    id === "." || id === ".." || /^__.*__$/.test(id) ||
    typeof title !== "string" || !title.trim() || title.length > 300 ||
    typeof description !== "string" || !description.trim() || description.length > 1000 ||
    typeof cover !== "string" || !/^https:\/\/[^\s]+$/i.test(cover) || cover.length > 2048 ||
    !Array.isArray(tags) || tags.length > 30 ||
    tags.some((tag) => typeof tag !== "string" || tag.length > 100) ||
    typeof content !== "string" || content.length > 100000
  ) return res.status(400).json({ error: "Check the article fields and their lengths." });

  const html = sanitizeHtml(content, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img", "iframe", "s", "strike", "del"],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      img: ["src", "alt", "id", "width", "height"],
      iframe: ["src", "width", "height", "allowfullscreen", "frameborder"],
    },
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com"],
    allowedSchemesByTag: { img: ["https"], iframe: ["https"] },
    allowProtocolRelative: false,
  });
  if (html.length < 250) {
    return res.status(400).json({ error: "Article content must be at least 250 characters." });
  }

  try {
    const app = getApps()[0] ?? initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)),
    });
    const identity = await getAuth(app).verifyIdToken(token, true).catch(() => null);
    if (!identity) return res.status(401).end();

    const db = getFirestore(app);
    const article = db.collection("articles").doc(id);
    const quota = db.collection("publishRateLimits").doc(identity.uid);
    const reservation = await db.runTransaction(async (tx) => {
      const draft = await tx.get(article);
      if (draft.get("author") !== identity.uid) return 404;
      if (draft.get("draft") === false) return 200;
      if (draft.get("draft") !== true) return 404;
      const previous = await tx.get(quota);
      const minute = Math.floor(Date.now() / 60000);
      const count = previous.get("minute") === minute ? previous.get("count") : 0;
      if (count >= 5) return 429;
      tx.set(quota, { minute, count: count + 1 });
      return draft.updateTime;
    });
    if (reservation === 200) return res.status(200).json({ id });
    if (reservation === 404) return res.status(404).json({ error: "Draft not found." });
    if (reservation === 429) return res.status(429).json({ error: "Too many attempts. Try again in a minute." });

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 10000, maxRetries: 0 });
    const bodyText = sanitizeHtml(html.replace(/<[^>]+>/g, "$& "), { allowedTags: [], allowedAttributes: {} });
    const result = await openai.moderations.create({
      model: "omni-moderation-latest",
      input: [title, description, bodyText.replace(/&lt;|&gt;|&amp;/g, " ")].join("\n"),
    });
    if (result.results[0]?.flagged !== false) {
      return res.status(422).json({ error: "Moderation flagged this article. Review it before publishing." });
    }

    const published = await db.runTransaction(async (tx) => {
      const draft = await tx.get(article);
      if (draft.get("author") !== identity.uid) return false;
      if (draft.get("draft") === false) return true;
      if (!draft.updateTime?.isEqual(reservation)) return false;
      tx.set(article, {
        title, description, cover, tags, content: html, author: identity.uid,
        draft: false, date: FieldValue.serverTimestamp(), likes: [], likeCount: 0,
      });
      return true;
    });
    if (!published) return res.status(409).json({ error: "The draft changed. Review it and try again." });
    return res.status(200).json({ id });
  } catch {
    return res.status(503).json({ error: "Publishing is temporarily unavailable. Try again later." });
  }
}
