import { EditorContent, useEditor } from "@tiptap/react";
import Dropcursor from "@tiptap/extension-dropcursor";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import Image from "@tiptap/extension-image";
import { storage } from "../../firebase/firebase";
import { useState, useEffect } from "react";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/firebase.js";
import { deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import TagsInput from "../TagsInput/TagsInput.jsx";

import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import DOMPurify from "dompurify";
import ImageResize from "tiptap-extension-resize-image";

import UseModerate from "../../hooks/UseModerate.js";

// import { content } from '../content.js'

const MenuBar = ({
  editor,
  editingDraft,
  titleData,
  descriptionData,
  coverData,
  tagsData,
  userId,
  userDataState,
}) => {
  const navigate = useNavigate();
  if (!editor) {
    return null;
  }

  const [image, setAddImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(titleData);
  const [description, setDescription] = useState(descriptionData);
  const [tags, setTags] = useState(tagsData);
  const [cover, setCover] = useState(coverData);

  const addImage = (url, id) => {
    if (url) {
      editor
        .chain()
        .focus()
        .insertContent(
          '<div><img alt="Article Image" id="' +
            id +
            '" src="' +
            url +
            '" /></div>'
        )
        .run();
    }
  };

  const [user] = useAuthState(auth);

  function handleSave() {
    const userData = userDataState;
    if (!userData) {
      console.log("no user found");
      return;
    }
    setLoading(true);
    const html = DOMPurify.sanitize(editor.getHTML());

    const linkTitle = title
      .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
      .toLowerCase();
    const docID = userId + userData.username + uuidv4() + "-" + linkTitle;
    const docRef = doc(db, "articles", docID);
    setDoc(docRef, {
      content: html,
      title: title,
      author: userId,
      date: new Date(),
      draft: true,
      description: description,
      cover: cover,
      tags: tags,
      likes: [],
      likeCount: 0,
    })
      .then(() => {
        const docAuthorRef = doc(db, "users", user.uid);
        updateDoc(docAuthorRef, { articles: arrayUnion(docID) })
          .then(() => {
            console.log("Article Saved");

            // window.location.replace('/write/' + docID);
            navigate("/write/" + docID);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function deleteUnusedImages() {
    const folder = editingDraft + "/";
    const listRef = ref(storage, "images/" + folder);

    listAll(listRef)
      .then((res) => {
        const allArticleImages = Array.from(
          document.querySelectorAll("img")
        ).map((img) => img.id);
        res.items.forEach((itemRef) => {
          if (!allArticleImages.includes(itemRef.name)) {
            deleteObject(ref(storage, "images/" + folder + itemRef.name))
              .then(() => {
                console.log("image deleted");
              })
              .catch((error) => {
                return;
              });
          }
        });
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        return;
      });
  }

  function handleSaveToDraft() {
    const userData = userDataState;
    if (!userData) {
      console.log("no user found");
      return;
    }
    setLoading(true);
    const html = DOMPurify.sanitize(editor.getHTML());

    const docID = editingDraft;
    const docRef = doc(db, "articles", docID);
    setDoc(docRef, {
      content: html,
      title: title,
      author: userId,
      date: new Date(),
      draft: true,
      description: description,
      cover: cover,
      tags: tags,
      likes: [],
      likeCount: 0,
    })
      .then(() => {
        deleteUnusedImages();
        localStorage.removeItem(docID);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handlePublish() {
    UseModerate(title + " " + description + " " + editor.getText())
      .then((response) => {
        if (response) {
          alert(
            "Your Article may contain nsfw content. Please review your article before publishing. If not, report this bug: https://discord.gg/xXaXAjEN47"
          );
          return;
        } else {
          const userData = userDataState;
          if (!userData) {
            console.log("no user found");
            return;
          }

          setLoading(true);
          const html = DOMPurify.sanitize(editor.getHTML());
          if (
            !title ||
            !description ||
            !cover ||
            html.length < 250 ||
            description.length > 1000
          ) {
            alert(
              "Please fill in the title, description, and/or cover image. Content must be at least 250 characters long and description must be less than 1000 characters"
            );
            setLoading(false);
            return;
          }
          deleteUnusedImages();
          const linkTitle = title
            .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, "")
            .toLowerCase();
          const docID =
            userId +
            userData.username +
            uuidv4().split("-")[0] +
            "-" +
            linkTitle;
          const docRef = doc(db, "articles", docID);
          setDoc(docRef, {
            content: html,
            title: title,
            author: userId,
            date: new Date(),
            draft: false,
            description: description,
            cover: cover,
            tags: tags,
            likes: [],
            likeCount: 0,
          })
            .then(() => {
              if (docID !== editingDraft) {
                deleteDoc(doc(db, "articles", editingDraft));
                navigate("/article/" + docID);
              } else navigate("/article/" + docID);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      })
      .catch((error) => {
        alert(error);
        return;
      });
  }

  function setCoverImage(e) {
    addCoverImage(e.target.files[0]);
    handleSaveToDraft();
  }

  useEffect(() => {
    if (image !== null && editingDraft) {
      if (image.size > 1000000) {
        alert("image must be less than 1mb");
        return;
      }

      const folder = editingDraft + "/";
      const rand = uuidv4();
      const imageREF = ref(storage, "images/" + folder + rand);

      uploadBytes(imageREF, image)
        .then(() => {
          getDownloadURL(imageREF)
            .then((url) => {
              addImage(url, rand);
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [image]);

  if (loading) {
    return <p>Loading...</p>;
  }

  function addCoverImage(image) {
    if (image.size > 1000000) {
      alert("image must be less than 1mb");
      return;
    }
    const userData = userDataState;
    const coverRef = ref(
      storage,
      "cover/" +
        userData.username +
        userId +
        userData.articles.length +
        editingDraft
    );
    uploadBytes(coverRef, image)
      .then(() => {
        getDownloadURL(coverRef)
          .then((url) => {
            setCover(url);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, parseInt(640, 10)) || 640,
        height: Math.max(180, parseInt(480, 10)) || 480,
      });
    }
  };

  // const setLink = useCallback(() => {
  //   const previousUrl = editor.getAttributes('link').href
  //   const url = window.prompt('URL', previousUrl)

  //   // cancelled
  //   if (url === null) {
  //     return
  //   }

  //   // empty
  //   if (url === '') {
  //     editor.chain().focus().extendMarkRange('link').unsetLink()
  //       .run()

  //     return
  //   }

  //   // update link
  //   editor.chain().focus().extendMarkRange('link').setLink({ href: url })
  //     .run()
  // }, [editor])

  return (
    <div className="z-10 control-group w-[100%] relative md:w-[33%] ">
      <div className="button-group w-[100%] flex flex-wrap gap-3 sticky top-8">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          Code
        </button>

        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          H3
        </button>

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          Blockquote
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          Horizontal rule
        </button>

        <button onClick={() => editor.chain().focus().undo().run()}>
          Undo
        </button>
        <button onClick={() => editor.chain().focus().redo().run()}>
          Redo
        </button>
        <button id="add" onClick={addYoutubeVideo}>
          Add YouTube video
        </button>
        {/* <button onClick={setLink} className={editor.isActive('link') ? 'is-active' : ''}>
            Set link
          </button> */}
        <input
          id="addImage"
          type="file"
          onChange={(event) => setAddImage(event.target.files[0])}
          hidden
          accept="image/*"
        />
        {editingDraft && (
          <label htmlFor="addImage" className="btn">
            Add Image
          </label>
        )}
        <hr className="w-full h-1" />

        {editingDraft ? (
          <>
            <button onClick={handleSaveToDraft}>Save</button>
            <button
              onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              Publish
            </button>
            <input
              id="addCoverImage"
              type="file"
              onChange={(e) => setCoverImage(e)}
              hidden
              accept="image/*"
            />
            <label htmlFor="addCoverImage" className="btn">
              Upload Cover Image
            </label>
            {cover !== "" || coverData !== "" ? (
              <p>Cover Image Uploaded</p>
            ) : (
              <p>No Cover Image</p>
            )}
          </>
        ) : (
          <>
            <button onClick={handleSave}>Save as New Draft</button>
          </>
        )}
        {loading && <p>Loading...</p>}
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Are you sure you want to publish?
            </h3>
            <p className="py-4">You won't be able to correct changes!</p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
              <button className="btn btn-primary" onClick={handlePublish}>
                Publish
              </button>
            </div>
          </div>
        </dialog>

        <hr className="w-full h-1" />
        <div className="w-full  h-[30px] md:h-[80px]">
          <input
            type="text"
            placeholder="Title"
            className="input w-full max-w-full h-full text-1xl md:text-3xl"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="w-full  h-[30px] md:h-[80px]">
          <input
            type="text"
            placeholder="Description"
            className="input w-full max-w-full h-full text-1xl md:text-3xl"
            id="title"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <TagsInput color="default" values={tags} onChange={setTags} />
      </div>
    </div>
  );
};

export default ({
  editing,
  content,
  editingDraft,
  title,
  description,
  cover,
  tags,
  userId,
  userDataState,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: "language-jsx",
          },
        },
      }),

      Dropcursor,
      Image,
      ImageResize,
      Link.configure({
        validate: (href) => /^https?:\/\//.test(href),
      }),
      Youtube,
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg focus:outline-none w-full sm:w-[50vw]",
        spellcheck: "false",
      },
    },
  });

  return (
    <>
      {editing && (
        <MenuBar
          editor={editor}
          editingDraft={editingDraft}
          titleData={title}
          descriptionData={description}
          coverData={cover}
          tagsData={tags}
          userId={userId}
          userDataState={userDataState}
        />
      )}
      <EditorContent editor={editor} />
    </>
  );
};
