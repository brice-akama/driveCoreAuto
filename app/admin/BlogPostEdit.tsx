"use client";

import React, { useState, useRef } from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  DateInput,
  EditProps,
  useNotify,
  useRedirect,
  useRecordContext,
} from "react-admin";
import { RichTextInput } from "ra-input-rich-text";
import { Button } from "@mui/material";
import MediaModal from "./MediaModal";
import type Quill from "quill";

const LANGUAGES = ["en", "de", "fr", "es"];


const BlogPostEdit: React.FC<EditProps> = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const record = useRecordContext();
  const id = record?.id || record?._id;

  const [file, setFile] = useState<File | null>(null);
  const [openMediaModal, setOpenMediaModal] = useState(false);
  const quillRef = useRef<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSelectImage = (imageUrl: string) => {
    const editor: Quill = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection();
      if (range) {
        editor.insertEmbed(range.index, "image", imageUrl);
      }
    }
    setOpenMediaModal(false);
  };

  const handleSubmit = async (values: any) => {
  const id = values?.id || values?._id;
  if (!id) {
    notify("Cannot update blog post: ID is missing", { type: "warning" });
    return;
  }

  const formData = new FormData();

  LANGUAGES.forEach((lang) => {
    formData.append(`title.${lang}`, values?.title?.[lang] || "");
    formData.append(`content.${lang}`, values?.content?.[lang] || "");
    formData.append(`metaTitle.${lang}`, values?.metaTitle?.[lang] || "");
    formData.append(`metaDescription.${lang}`, values?.metaDescription?.[lang] || "");
  });

  formData.append("author", values.author || "");
  formData.append("category", values.category || "");

  if (file) {
    formData.append("image", file);
  }

  try {
    const res = await fetch(`/api/blog?id=${id}`, {
      method: "PUT",
      body: formData,
    });

    if (res.ok) {
      notify("Blog post updated successfully", { type: "success" });
      redirect("/blog");
    } else {
      notify("Failed to update blog post", { type: "error" });
    }
  } catch (error) {
    notify("Error updating blog post", { type: "error" });
    console.error("Update error:", error);
  }
};


  return (
    <Edit {...props}>
      <SimpleForm onSubmit={handleSubmit} record={record}>
        <TextInput source="author" label="Author" fullWidth />
        <TextInput source="category" label="Category" fullWidth />

        <fieldset>
          <legend>Title</legend>
          {LANGUAGES.map((lang) => (
            <TextInput
              key={lang}
              source={`title.${lang}`}
              label={`Title (${lang.toUpperCase()})`}
              fullWidth
            />
          ))}
        </fieldset>

        <fieldset>
          <legend>Content</legend>
          {LANGUAGES.map((lang) => {
            const isEnglish = lang === "en";
            return (
              <div key={lang} style={{ marginBottom: 20 }}>
                <label>{`Content (${lang.toUpperCase()})`}</label>
                <RichTextInput
                  source={`content.${lang}`}
                  label={false}
                  fullWidth
                  ref={isEnglish ? quillRef : undefined}
                />
                {isEnglish && (
                  <Button
                    variant="outlined"
                    onClick={() => setOpenMediaModal(true)}
                    style={{ marginTop: 8 }}
                  >
                    Insert Image
                  </Button>
                )}
              </div>
            );
          })}
        </fieldset>

        <fieldset>
          <legend>Meta Title</legend>
          {LANGUAGES.map((lang) => (
            <TextInput
              key={lang}
              source={`metaTitle.${lang}`}
              label={`Meta Title (${lang.toUpperCase()})`}
              fullWidth
            />
          ))}
        </fieldset>

        <fieldset>
          <legend>Meta Description</legend>
          {LANGUAGES.map((lang) => (
            <TextInput
              key={lang}
              source={`metaDescription.${lang}`}
              label={`Meta Description (${lang.toUpperCase()})`}
              multiline
              fullWidth
            />
          ))}
        </fieldset>

        <label>Upload Blog Thumbnail:</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />

        <DateInput source="createdAt" label="Created At" />

        <MediaModal
          open={openMediaModal}
          onClose={() => setOpenMediaModal(false)}
          onSelectImage={handleSelectImage}
        />
      </SimpleForm>
    </Edit>
  );
};

export default BlogPostEdit;
