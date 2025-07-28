// app/admin/products/ProductShow.tsx
"use client";

import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  BooleanField,
  ArrayField,
  SingleFieldList,
  ChipField,
  ImageField,
} from "react-admin";

const languages = ["en", "de", "fr", "es"];
const seoFields = ["seoTitle", "seoDescription", "seoKeywords"];

export const ProductShow = () => (
  <Show>
    <SimpleShowLayout>
      {/* Show multilingual names */}
      {languages.map((lang) => (
        <TextField
          key={`name_${lang}`}
          source={`name.${lang}`}
          label={`Name (${lang.toUpperCase()})`}
        />
      ))}

      <NumberField source="price" />
      <TextField source="category" />
      <BooleanField source="isPublished" />
      <BooleanField source="popularProduct" />
      <BooleanField source="edibles" />
      <BooleanField source="toyota" />
      <BooleanField source="acura" />
      <BooleanField source="mercedes" />
      <BooleanField source="honda" />
      <BooleanField source="lexus" />
      <BooleanField source="infiniti" />
      <BooleanField source="subaru" />
      <BooleanField source="nissan" />

      {/* Multilingual other fields */}
      {["description", "Specifications", "Shipping", "Warranty"].map((field) =>
        languages.map((lang) => (
          <TextField
            key={`${field}_${lang}`}
            source={`${field}.${lang}`}
            label={`${field} (${lang.toUpperCase()})`}
          />
        ))
      )}

      {/* SEO fields */}
      {seoFields.map((field) =>
        languages.map((lang) => (
          <TextField
            key={`${field}_${lang}`}
            source={`${field}.${lang}`}
            label={`${field} (${lang.toUpperCase()})`}
          />
        ))
      )}

      {/* Weights */}
      <ArrayField source="weights">
        <SingleFieldList>
          <ChipField source="label" />
        </SingleFieldList>
      </ArrayField>

      {/* Seeds (if present) */}
      <ArrayField source="seeds" label="Seeds">
        <SingleFieldList>
          <ChipField source="label" />
        </SingleFieldList>
      </ArrayField>

      {/* Images */}
      <ImageField source="mainImage" label="Main Image" />
      <ArrayField source="thumbnails" label="Thumbnails">
        <SingleFieldList>
          {/* Empty source here renders whole thumbnail URL */}
          <ImageField source="" />
        </SingleFieldList>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
