"use client";
import React, { useState, useEffect } from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  useNotify,
  useRedirect,
  EditProps,
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

type Lang = "en" | "fr" | "es" | "de";

const CategoryEdit: React.FC<EditProps> = (props) => {
  const [file, setFile] = useState<File | null>(null);
  const [slugs, setSlugs] = useState<Record<Lang, string>>({
    en: "",
    fr: "",
    es: "",
    de: "",
  });

  const notify = useNotify();
  const redirect = useRedirect();
  const { record } = props;

  // Initialize slugs when record loads
  useEffect(() => {
    if (record) {
      setSlugs({
        en: record.name?.en ? generateSlug(record.name.en) : "",
        fr: record.name?.fr ? generateSlug(record.name.fr) : "",
        es: record.name?.es ? generateSlug(record.name.es) : "",
        de: record.name?.de ? generateSlug(record.name.de) : "",
      });
    }
  }, [record]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) setFile(event.target.files[0]);
  };

  const handleNameChange = (lang: Lang, value: string) => {
    setSlugs((prev) => ({ ...prev, [lang]: generateSlug(value) }));
  };

  const handleSubmit = async (values: any) => {
    if (!record?._id) return notify("Record ID missing", { type: "error" });

    const formData = new FormData();

    (["en", "fr", "es", "de"] as Lang[]).forEach((lang) => {
      if (values[`name_${lang}`]?.trim())
        formData.append(`name_${lang}`, values[`name_${lang}`].trim());
      formData.append(`slug_${lang}`, slugs[lang] || "");
      if (values[`description_${lang}`]?.trim())
        formData.append(`description_${lang}`, values[`description_${lang}`].trim());
      if (values[`metaTitle_${lang}`]?.trim())
        formData.append(`metaTitle_${lang}`, values[`metaTitle_${lang}`].trim());
      if (values[`metaDescription_${lang}`]?.trim())
        formData.append(`metaDescription_${lang}`, values[`metaDescription_${lang}`].trim());
    });

    if (file) formData.append("image", file);

    try {
      const response = await fetch(`/api/category?id=${record._id}`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        notify("Category updated successfully", { type: "success" });
        redirect("/category");
      } else {
        throw new Error("Failed to update category");
      }
    } catch (error) {
      notify("Error updating category", { type: "error" });
    }
  };

  return (
    <Edit {...props}>
      <SimpleForm onSubmit={handleSubmit} record={record}>
        {(["en", "fr", "es", "de"] as Lang[]).map((lang) => (
          <div
            key={lang}
            style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
          >
            <h4>{lang.toUpperCase()}</h4>

            <TextInput
              source={`name_${lang}`}
              label={`Name (${lang})`}
              validate={required()}
              onChange={(e) => handleNameChange(lang, e.target.value)}
            />

            <TextInput
              source={`slug_${lang}`}
              label={`Slug (${lang})`}
              value={slugs[lang]}
              disabled
            />

            <TextInput
              source={`description_${lang}`}
              label={`Description (${lang})`}
              multiline
            />

            <TextInput
              source={`metaTitle_${lang}`}
              label={`Meta Title (${lang})`}
            />

            <TextInput
              source={`metaDescription_${lang}`}
              label={`Meta Description (${lang})`}
              multiline
            />
          </div>
        ))}

        <InputLabel style={{ marginTop: "1em" }}>Upload New Category Image:</InputLabel>
        <Button component="label" variant="outlined" startIcon={<UploadIcon />}>
          Choose File
          <input type="file" hidden accept="image/*" onChange={handleFileChange} />
        </Button>
        {file && <p style={{ marginTop: 8 }}>Selected: {file.name}</p>}

        <button type="submit">Update Category</button>
      </SimpleForm>
    </Edit>
  );
};

export default CategoryEdit;
