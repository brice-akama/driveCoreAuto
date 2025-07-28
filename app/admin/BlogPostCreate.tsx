"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  DateInput,
  CreateProps,
  useNotify,
  useRedirect,
} from "react-admin";
import { RichTextInput } from "ra-input-rich-text";



const LANGUAGES = ["en", "de", "fr", "es"];


const BlogPostCreate: React.FC<CreateProps> = (props) => {
  const [file, setFile] = React.useState<File | null>(null);
  const notify = useNotify();
  const redirect = useRedirect();

 

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  
  
  const handleSubmit = async (values: any) => {
    const formData = new FormData();

    LANGUAGES.forEach((lang) => {
      formData.append(`title.${lang}`, values?.title?.[lang] || "");
      formData.append(`content.${lang}`, values?.content?.[lang] || "");
      formData.append(`metaTitle.${lang}`, values?.metaTitle?.[lang] || "");
      formData.append(`metaDescription.${lang}`, values?.metaDescription?.[lang] || "");
    });

    formData.append("author", values.author || "");
    formData.append("category", values.category || "");

    if (file) formData.append("image", file);

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        notify("Blog post created successfully", { type: "success" });
        redirect("/blog");
      } else {
        throw new Error("Failed to create blog post");
      }
    } catch {
      notify("Error creating blog post", { type: "error" });
    }
  };

  return (
    <Create {...props}>
      <SimpleForm onSubmit={handleSubmit}>
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
          {LANGUAGES.map((lang) => (
            <RichTextInput
              key={lang}
              source={`content.${lang}`}
              label={`Content (${lang.toUpperCase()})`}
              fullWidth
            />
          ))}
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

        <input type="file" accept="image/*" onChange={handleFileChange} />

        <DateInput source="createdAt" label="Created At" defaultValue={new Date()} />

        <button type="submit">Create Blog Post</button>
      </SimpleForm>
    </Create>
  );
};

export default BlogPostCreate;
