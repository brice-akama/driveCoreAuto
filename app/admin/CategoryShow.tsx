"use client";
import React from "react";
import { Show, SimpleShowLayout, TextField, ImageField, ShowProps } from "react-admin";

type Lang = "en" | "fr" | "es" | "de";

const CategoryShow: React.FC<ShowProps> = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        {(["en", "fr", "es", "de"] as Lang[]).map((lang) => (
          <div key={lang} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <h4>{lang.toUpperCase()}</h4>
            <TextField source={`name.${lang}`} label={`Name (${lang})`} />
            <TextField source={`slug.${lang}`} label={`Slug (${lang})`} />
            <TextField source={`description.${lang}`} label={`Description (${lang})`} />
            <TextField source={`metaTitle.${lang}`} label={`Meta Title (${lang})`} />
            <TextField source={`metaDescription.${lang}`} label={`Meta Description (${lang})`} />
          </div>
        ))}
        <ImageField source="imageUrl" label="Category Image" />
      </SimpleShowLayout>
    </Show>
  );
};

export default CategoryShow;
