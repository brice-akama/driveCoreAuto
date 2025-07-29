"use client";

import React, { useState } from "react";
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  useNotify,
  ArrayInput,
  SimpleFormIterator,
} from "react-admin";
import { RichTextInput } from "ra-input-rich-text";
import { FiUpload } from "react-icons/fi";

const languages = ["en", "de", "fr", "es"];


export const ProductCreate: React.FC = (props) => {
  const notify = useNotify();

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]);
  const [category, setCategory] = useState("");
  const [formValues, setFormValues] = useState<Record<
    string,
    Record<string, string>
  >>({});

  const handleMainImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    setMainImage(file);
  };

  const handleThumbnailChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0] || null;
    const updated = [...thumbnails];
    updated[index] = file;
    setThumbnails(updated);
  };

  const handleInputChange = (
    field: string,
    lang: string,
    value: string
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
  };

  const handleSubmit = async (data: any) => {
    const formData = new FormData();

    // Base fields
    formData.append("price", data.price);
    formData.append("category", category);
    formData.append("popularProduct", data.popularProduct ? "true" : "false");
    formData.append("isPublished", data.isPublished ? "true" : "false");

    formData.append("toyota", data.toyota ? "true" : "false");
    formData.append("acura", data.acura ? "true" : "false");
    formData.append("scion", data.scion ? "true" : "false");
    formData.append("honda", data.honda ? "true" : "false");
    formData.append("lexus", data.lexus ? "true" : "false");
    formData.append("infiniti", data.infiniti ? "true" : "false");
    formData.append("subaru", data.subaru ? "true" : "false");
    formData.append("nissan", data.nissan ? "true" : "false");

    // Serialize arrays
    if (data.weights?.length) formData.append("weights", JSON.stringify(data.weights));
    if (data.seeds?.length) formData.append("seeds", JSON.stringify(data.seeds));

    // Upload images
    if (mainImage) formData.append("mainImage", mainImage);

    thumbnails.forEach((file) => {
      if (file) formData.append("thumbnails", file);
    });

    // Multilingual fields
    const multilingualFields = [
      "name",
      "description",
      "Specifications",
      "Shipping",
      "Warranty",
      "seoTitle",
      "seoDescription",
      "seoKeywords",
    ];

    multilingualFields.forEach((field) => {
      const values = formValues[field] || {};
      languages.forEach((lang) => {
        formData.append(`${field}[${lang}]`, values[lang] || "");
      });
    });

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        notify("Product created successfully", { type: "success" });
      } else {
        const text = await res.text();
        notify(`Failed: ${text}`, { type: "error" });
      }
    } catch (err) {
      notify("Error occurred", { type: "error" });
    }
  };

  return (
    <Create {...props}>
      <SimpleForm onSubmit={handleSubmit}>
        {/* Multilingual Product Name */}
        <h3>Product Name</h3>
        {languages.map((lang) => (
          <TextInput
            key={`name-${lang}`}
            source={`name_${lang}`}
            label={`Name (${lang.toUpperCase()})`}
            onChange={(e) => handleInputChange("name", lang, e.target.value)}
            fullWidth
          />
        ))}

        {/* Multilingual Description */}
        <h3>Descriptions</h3>
        {languages.map((lang) => (
          <RichTextInput
            key={`description-${lang}`}
            source={`description_${lang}`}
            label={`Description (${lang.toUpperCase()})`}
            // FIXED: onChange gets the value directly — no event
            onChange={(value) => handleInputChange("description", lang, value || "")}
            fullWidth
          />
        ))}

        {/* Multilingual Specifications */}
        <h3>Specifications</h3>
        {languages.map((lang) => (
          <RichTextInput
            key={`Specifications-${lang}`}
            source={`Specifications_${lang}`}
            label={`Specifications (${lang.toUpperCase()})`}
            onChange={(value) => handleInputChange("Specifications", lang, value || "")}
            fullWidth
          />
        ))}

        {/* Shipping Info */}
        <h3>Shipping</h3>
        {languages.map((lang) => (
          <RichTextInput
            key={`Shipping-${lang}`}
            source={`Shipping_${lang}`}
            label={`Shipping (${lang.toUpperCase()})`}
            onChange={(value) => handleInputChange("Shipping", lang, value || "")}
            fullWidth
          />
        ))}

        {/* Warranty */}
        <h3>Warranty</h3>
        {languages.map((lang) => (
          <RichTextInput
            key={`Warranty-${lang}`}
            source={`Warranty_${lang}`}
            label={`Warranty (${lang.toUpperCase()})`}
            onChange={(value) => handleInputChange("Warranty", lang, value || "")}
            fullWidth
          />
        ))}

        <NumberInput source="price" label="Price ($)" />

        {/* Category */}
        <TextInput
          source="category"
          label="Category"
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
        />

        {/* Brand Flags */}
        <h3>Brand Flags</h3>
        <BooleanInput source="toyota" label="Toyota" />
        <BooleanInput source="acura" label="Acura" />
        <BooleanInput source="scion" label="Scion" />
        <BooleanInput source="honda" label="Honda" />
        <BooleanInput source="lexus" label="Lexus" />
        <BooleanInput source="infiniti" label="Infiniti" />
        <BooleanInput source="subaru" label="Subaru" />
        <BooleanInput source="nissan" label="Nissan" />

        {/* Other Booleans */}
        <BooleanInput source="popularProduct" label="Popular Product" />
        <BooleanInput source="isPublished" label="Publish" />

        {/* Main Image Upload */}
        <div style={{ margin: "1rem 0" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiUpload />
            Main Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleMainImageChange}
            style={{ marginBottom: "0.5rem" }}
          />
          {mainImage && (
            <img
              src={URL.createObjectURL(mainImage)}
              alt="Main Preview"
              style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
            />
          )}
        </div>

        {/* Thumbnail Uploads */}
        <div style={{ margin: "1rem 0" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FiUpload />
            Thumbnails (up to 4):
          </label>
          {thumbnails.map((file, i) => (
            <div key={i} style={{ marginBottom: "1rem" }}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleThumbnailChange(i, e)}
                style={{ marginBottom: "0.5rem" }}
              />
              {file && (
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Thumbnail ${i + 1}`}
                  style={{ maxWidth: "150px", maxHeight: "150px", objectFit: "cover" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Weight Options */}
        <ArrayInput source="weights" label="Weights">
          <SimpleFormIterator>
            <TextInput source="label" label="Label" />
            <NumberInput source="price" label="Price ($)" />
          </SimpleFormIterator>
        </ArrayInput>

        {/* Seed Options (conditional) */}
        {category.toLowerCase().includes("seeds") && (
          <ArrayInput source="seeds" label="Seeds">
            <SimpleFormIterator>
              <TextInput source="label" label="Label" />
              <NumberInput source="price" label="Price ($)" />
            </SimpleFormIterator>
          </ArrayInput>
        )}

        {/* SEO Metadata */}
        <h3>SEO Metadata</h3>
        {["seoTitle", "seoDescription", "seoKeywords"].map((field) =>
          languages.map((lang) => (
            <TextInput
              key={`${field}-${lang}`}
              source={`${field}_${lang}`}
              label={`${field.replace("seo", "SEO ")} (${lang.toUpperCase()})`}
              onChange={(e) =>
                handleInputChange(field, lang, e.target.value)
              }
              fullWidth
            />
          ))
        )}
      </SimpleForm>
    </Create>
  );
};
