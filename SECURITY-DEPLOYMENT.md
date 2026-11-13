# Deploy server-side publishing

1. Revoke the exposed OpenAI key in the OpenAI dashboard and review project usage. Remove the old `VITE_OPENAI_API_KEY` and `VITE_OPENAI_ORG_KEY` variables from Vercel.
2. Configure `OPENAI_API_KEY` and `FIREBASE_SERVICE_ACCOUNT_JSON` as server-only Vercel secrets. The latter is the Firebase Admin service-account JSON for the same project as the browser's Firebase configuration. Use a dedicated account with the Firestore access needed by the endpoint and Firebase Auth user-read access for revoked-token checks. Keep preview credentials separate from production.
3. In the existing Firestore policy, replace the write grants for `/articles/{articleId}` with the following block. Preserve the current read grants and other collections. Remove any overlapping write grants that would also allow these operations, since Firestore combines matching grants with OR. Leave `/publishRateLimits/{uid}` inaccessible to clients, including through wildcard rules.

```firestore
function changesOwnLike() {
  let uid = request.auth.uid;
  let before = resource.data.likes;
  let after = request.resource.data.likes;
  let delta = request.resource.data.likeCount - resource.data.likeCount;
  return request.resource.data.diff(resource.data).affectedKeys()
    .hasOnly(['likes', 'likeCount'])
    && ((!before.hasAny([uid]) && after == before.concat([uid]) && delta == 1)
      || (before.hasAny([uid]) && after == before.removeAll([uid]) && delta == -1));
}

function appendsOwnComment() {
  let before = resource.data.get('comments', []);
  let after = request.resource.data.comments;
  let comment = after[before.size()];
  return request.resource.data.diff(resource.data).affectedKeys()
    .hasOnly(['comments'])
    && comment.keys().hasOnly(['author', 'comment'])
    && comment.author == request.auth.uid
    && comment.comment is string
    && after == before.concat([comment]);
}

allow create: if request.auth != null
  && request.resource.data.author == request.auth.uid
  && request.resource.data.draft == true;

allow update: if request.auth != null && (
  (resource.data.author == request.auth.uid
    && resource.data.draft == true
    && request.resource.data.author == request.auth.uid
    && request.resource.data.draft == true)
  || (resource.data.draft == false
    && (changesOwnLike() || appendsOwnComment()))
);

allow delete: if request.auth != null
  && resource.data.author == request.auth.uid;
```

The published-article rules allow a user to add or remove their own like with the corresponding count change, or append one comment under their own UID. Retain any stricter checks from the existing rules. The Firebase Admin SDK uses IAM, so these client rules do not prevent the server from publishing.

4. Apply the rules and deploy together. Old browser sessions may need a refresh before they can publish. Test draft creation and editing, permitted publication, flagged content, a simulated moderation outage, and retries. With a signed-in browser client, verify that directly creating a published article, changing a draft to published, and modifying a published article's content are denied. Verify likes, comments, and owner deletion still work.
5. Scan `dist` and the deployed JavaScript for credential patterns, reporting filenames or counts only. Restrict or remove affected historical deployments where practical. Never roll back to a build that embeds a key.
