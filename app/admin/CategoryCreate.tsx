"use client";
import React, { useState } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  useNotify,
  useRedirect,
  CreateProps,
  required,
} from "react-admin";
import { InputLabel, Button } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";

// Slug generator
const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

// Allowed language keys
type Lang = "en" | "fr" | "es" | "de";

const CategoryCreate: React.FC<CreateProps> = (props) => {
  const [file, setFile] = useState<File | null>(null);
  const [slugs, setSlugs] = useState<Record<Lang, string>>({
    en: "",
    fr: "",
    es: "",
    de: "",
  });

  const notify = useNotify();
  const redirect = useRedirect();

  // File change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target?.files) setFile(event.target.files[0]);
  };

  // Update slug when name changes
  const handleNameChange = (lang: Lang, value: string) => {
    setSlugs((prev) => ({ ...prev, [lang]: generateSlug(value) }));
  };

  // Form submission
  const handleSubmit = async (values: any) => {
  console.log("🚀 Form submitted!");
  console.log("Values from RA form:", values);

  const formData = new FormData();

  (["en", "fr", "es", "de"] as Lang[]).forEach((lang) => {
    console.log(`\n--- Language: ${lang} ---`);

    console.log("Name:", values[`name_${lang}`]);
    console.log("Slug (from state):", slugs[lang]);
    console.log("Description:", values[`description_${lang}`]);
    console.log("MetaTitle:", values[`metaTitle_${lang}`]);
    console.log("MetaDescription:", values[`metaDescription_${lang}`]);

    if (values[`name_${lang}`]) formData.append(`name_${lang}`, values[`name_${lang}`]);
    formData.append(`slug_${lang}`, slugs[lang] || generateSlug(values[`name_${lang}`] || ""));
    if (values[`description_${lang}`]?.trim()) formData.append(`description_${lang}`, values[`description_${lang}`].trim());
    if (values[`metaTitle_${lang}`]?.trim()) formData.append(`metaTitle_${lang}`, values[`metaTitle_${lang}`].trim());
    if (values[`metaDescription_${lang}`]?.trim()) formData.append(`metaDescription_${lang}`, values[`metaDescription_${lang}`].trim());
  });

  if (file) formData.append("image", file);

  console.log("📦 FormData entries:");
  for (let [key, val] of formData.entries()) {
    console.log(key, val);
  }

  try {
    const response = await fetch("/api/category", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      notify("Category created successfully", { type: "success" });
      redirect("/category");
    } else {
      throw new Error("Failed to create category");
    }
  } catch (error) {
    notify("Error creating category", { type: "error" });
  }
};

  return (
    <Create {...props}>
      <SimpleForm onSubmit={handleSubmit}>
        {(["en", "fr", "es", "de"] as Lang[]).map((lang) => (
          <div key={lang} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <h4>{lang.toUpperCase()}</h4>

            {/* Name input */}
            <TextInput
              source={`name_${lang}`}
              label={`Name (${lang})`}
              validate={required()}
              onChange={(e) => handleNameChange(lang, e.target.value)}
            />

            {/* Slug input (read-only) */}
            <TextInput
              source={`slug_${lang}`}
              label={`Slug (${lang})`}
              value={slugs[lang]}
              disabled
            />

            {/* Description */}
            <TextInput
              source={`description_${lang}`}
              label={`Description (${lang})`}
              multiline
            />

            {/* Meta Title */}
            <TextInput
  source={`metaTitle_${lang}`}
  label={`Meta Title (${lang})`}
  onChange={(e) => {
    console.log(`[${lang}] Meta Title typed:`, e.target.value);
  }}
/>


            {/* Meta Description */}
            <TextInput
              source={`metaDescription_${lang}`}
              label={`Meta Description (${lang})`}
              multiline
            />
          </div>
        ))}

        {/* Image upload */}
        <InputLabel style={{ marginTop: "1em" }}>Upload Category Image:</InputLabel>
        <Button component="label" variant="outlined" startIcon={<UploadIcon />}>
          Choose File
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>
        {file && <p style={{ marginTop: 8 }}>Selected: {file.name}</p>}

        <button type="submit">Create Category</button>
      </SimpleForm>
    </Create>
  );
};

export default CategoryCreate;
