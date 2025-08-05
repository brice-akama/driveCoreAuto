"use client";

import React, { useEffect, useState } from "react";
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  BooleanInput,
  ArrayInput,
  SimpleFormIterator,
  useNotify,
  useRedirect,
  useEditContext,
} from "react-admin";
import { RichTextInput } from "ra-input-rich-text";
import { FiUpload } from "react-icons/fi";

const languages = ["en", "de", "fr", "es"];


const ProductEditForm = () => {
  const notify = useNotify();
  const redirect = useRedirect();
  const { record } = useEditContext();

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [thumbnails, setThumbnails] = useState<(File | null)[]>([null, null, null, null]);
  const [category, setCategory] = useState("");
  const [formValues, setFormValues] = useState<Record<string, Record<string, string>>>({});

  useEffect(() => {
    if (record) {
      setCategory(record.category || "");
      const fields = [
        "name",
        "description",
        "Specifications",
        "Shipping",
        "Warranty",
        "seoTitle",
        "seoDescription",
        "seoKeywords",
      ];
      const initialValues: any = {};
      fields.forEach((field) => {
        initialValues[field] = record[field] || {};
      });
      setFormValues(initialValues);
    }
  }, [record]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMainImage(file);
  };

  const handleThumbnailChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const updated = [...thumbnails];
    updated[index] = file;
    setThumbnails(updated);
  };

  const handleInputChange = (field: string, lang: string, value: string) => {
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

    formData.append("id", record.id || record._id);
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
    formData.append("transmissionsToyotaAutomatic", data.transmissionsToyotaAutomatic ? "true" : "false");
formData.append("transmissionsToyotaManuel", data.transmissionsToyotaManuel ? "true" : "false");
formData.append("transmissionsHondataAutomatic", data.transmissionsHondataAutomatic ? "true" : "false");
formData.append("transmissionsHondaaManuel", data.transmissionsHondaaManuel ? "true" : "false");
formData.append("transmissionsAcuretaAutomatic", data.transmissionsAcuretaAutomatic ? "true" : "false");
formData.append("transmissionsAcureaManuel", data.transmissionsAcureaManuel ? "true" : "false");
formData.append("transmissionsInfinitAutomatic", data.transmissionsInfinitAutomatic ? "true" : "false");
formData.append("transmissionsInfinitManuel", data.transmissionsInfinitManuel ? "true" : "false");
formData.append("transmissionsSaburaAutomatic", data.transmissionsSaburaAutomatic ? "true" : "false");
formData.append("transmissionsSaburaManuel", data.transmissionsSaburaManuel ? "true" : "false");
formData.append("transmissionsScionAutomatic", data.transmissionsScionAutomatic ? "true" : "false");
formData.append("transmissionScionburaManuel", data.transmissionScionburaManuel ? "true" : "false");
formData.append("transmissionsNissanAutomatic", data.transmissionsNissanAutomatic ? "true" : "false");
formData.append("transmissionNissanburaManuel", data.transmissionNissanburaManuel ? "true" : "false");
formData.append("transmissionsLexusAutomatic", data.transmissionsLexusAutomatic ? "true" : "false");
formData.append("transmissionLexuxburaManuel", data.transmissionLexuxburaManuel ? "true" : "false");
formData.append("partsFluids", data.partsFluids ? "true" : "false");
formData.append("wheelsTires", data.wheelsTires ? "true" : "false");
formData.append("accessories", data.accessories ? "true" : "false");
formData.append("subframe", data.subframe ? "true" : "false");
formData.append("bumpers", data.bumpers ? "true" : "false");
formData.append("topSellers", data.topSellers ? "true" : "false");
formData.append("freeShipping", data.freeShipping ? "true" : "false");
formData.append("swapsToyota", data.swapsToyota ? "true" : "false");
formData.append("swapsHonda", data.swapsHonda ? "true" : "false");
formData.append("swapsAcura", data.swapsAcura ? "true" : "false");
formData.append("swapsScion", data.swapsScion ? "true" : "false");
formData.append("swapsLexus", data.swapsLexus ? "true" : "false");
formData.append("swapsNissan", data.swapsNissan ? "true" : "false");
formData.append("swapsSubaru", data.swapsSubaru ? "true" : "false");
formData.append("swapsInfiniti", data.swapsInfiniti ? "true" : "false");




    if (data.weights?.length) formData.append("weights", JSON.stringify(data.weights));
    if (data.seeds?.length) formData.append("seeds", JSON.stringify(data.seeds));
    if (mainImage) formData.append("mainImage", mainImage);
    thumbnails.forEach((file) => {
      if (file) formData.append("thumbnails", file);
    });

    Object.entries(formValues).forEach(([field, values]) => {
      languages.forEach((lang) => {
        formData.append(`${field}[${lang}]`, values[lang] || "");
      });
    });

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        notify("Product updated successfully", { type: "success" });
        redirect("list", "products");
      } else {
        const text = await res.text();
        notify(`Update failed: ${text}`, { type: "error" });
      }
    } catch (error) {
      console.error(error);
      notify("Error occurred", { type: "error" });
    }
  };

  return (
    <SimpleForm onSubmit={handleSubmit}>
      <h3>Product Name</h3>
      {languages.map((lang) => (
        <TextInput
          key={`name-${lang}`}
          source={`name.${lang}`}
          label={`Name (${lang.toUpperCase()})`}
          defaultValue={record?.name?.[lang] || ""}
          onChange={(e) => handleInputChange("name", lang, e.target.value)}
          fullWidth
        />
      ))}

      <h3>Descriptions</h3>
      {languages.map((lang) => (
        <RichTextInput
          key={`desc-${lang}`}
          source={`description.${lang}`}
          label={`Description (${lang.toUpperCase()})`}
          defaultValue={record?.description?.[lang] || ""}
          onChange={(val) => handleInputChange("description", lang, val || "")}
          fullWidth
        />
      ))}

      <h3>Specifications</h3>
      {languages.map((lang) => (
        <RichTextInput
          key={`spec-${lang}`}
          source={`Specifications.${lang}`}
          label={`Specifications (${lang.toUpperCase()})`}
          defaultValue={record?.Specifications?.[lang] || ""}
          onChange={(val) => handleInputChange("Specifications", lang, val || "")}
          fullWidth
        />
      ))}

      <h3>Shipping</h3>
      {languages.map((lang) => (
        <RichTextInput
          key={`shipping-${lang}`}
          source={`Shipping.${lang}`}
          label={`Shipping (${lang.toUpperCase()})`}
          defaultValue={record?.Shipping?.[lang] || ""}
          onChange={(val) => handleInputChange("Shipping", lang, val || "")}
          fullWidth
        />
      ))}

      <h3>Warranty</h3>
      {languages.map((lang) => (
        <RichTextInput
          key={`warranty-${lang}`}
          source={`Warranty.${lang}`}
          label={`Warranty (${lang.toUpperCase()})`}
          defaultValue={record?.Warranty?.[lang] || ""}
          onChange={(val) => handleInputChange("Warranty", lang, val || "")}
          fullWidth
        />
      ))}

      <NumberInput source="price" label="Price ($)" defaultValue={record?.price || 0} />
      <TextInput
        source="category"
        label="Category"
        defaultValue={record?.category || ""}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
      />

      <h3>Brand Flags</h3>
      <BooleanInput source="toyota" label="Toyota" defaultValue={record?.toyota} />
      <BooleanInput source="acura" label="Acura" defaultValue={record?.acura} />
      <BooleanInput source="scion" label="Scion" defaultValue={record?.scion} />
      <BooleanInput source="honda" label="Honda" defaultValue={record?.honda} />
      <BooleanInput source="lexus" label="Lexus" defaultValue={record?.lexus} />
      <BooleanInput source="infiniti" label="Infiniti" defaultValue={record?.infiniti} />
      <BooleanInput source="subaru" label="Subaru" defaultValue={record?.subaru} />
      <BooleanInput source="nissan" label="Nissan" defaultValue={record?.nissan} />
      <BooleanInput source="popularProduct" label="Popular Product" defaultValue={record?.popularProduct} />
      <BooleanInput source="isPublished" label="Publish" defaultValue={record?.isPublished} />

      <h3>Transmission Flags</h3>
<BooleanInput source="transmissionsToyotaAutomatic" label="Toyota Automatic" defaultValue={record?.transmissionsToyotaAutomatic} />
<BooleanInput source="transmissionsToyotaManuel" label="Toyota Manual" defaultValue={record?.transmissionsToyotaManuel} />
<BooleanInput source="transmissionsHondataAutomatic" label="Honda Automatic" defaultValue={record?.transmissionsHondataAutomatic} />
<BooleanInput source="transmissionsHondaaManuel" label="Honda Manual" defaultValue={record?.transmissionsHondaaManuel} />
<BooleanInput source="transmissionsAcuretaAutomatic" label="Acura Automatic" defaultValue={record?.transmissionsAcuretaAutomatic} />
<BooleanInput source="transmissionsAcureaManuel" label="Acura Manual" defaultValue={record?.transmissionsAcureaManuel} />
<BooleanInput source="transmissionsInfinitAutomatic" label="Infiniti Automatic" defaultValue={record?.transmissionsInfinitAutomatic} />
<BooleanInput source="transmissionsInfinitManuel" label="Infiniti Manual" defaultValue={record?.transmissionsInfinitManuel} />
<BooleanInput source="transmissionsSaburaAutomatic" label="Subaru Automatic" defaultValue={record?.transmissionsSaburaAutomatic} />
<BooleanInput source="transmissionsSaburaManuel" label="Subaru Manual" defaultValue={record?.transmissionsSaburaManuel} />
<BooleanInput source="transmissionsScionAutomatic" label="Scion Automatic" defaultValue={record?.transmissionsScionAutomatic} />
<BooleanInput source="transmissionScionburaManuel" label="Scion Manual" defaultValue={record?.transmissionScionburaManuel} />
<BooleanInput source="transmissionsNissanAutomatic" label="Nissan Automatic" defaultValue={record?.transmissionsNissanAutomatic} />
<BooleanInput source="transmissionNissanburaManuel" label="Nissan Manual" defaultValue={record?.transmissionNissanburaManuel} />
<BooleanInput source="transmissionsLexusAutomatic" label="Lexus Automatic" defaultValue={record?.transmissionsLexusAutomatic} />
<BooleanInput source="transmissionLexuxburaManuel" label="Lexus Manual" defaultValue={record?.transmissionLexuxburaManuel} />
<h3>Product Type Flags</h3>
<BooleanInput source="partsFluids" label="Parts & Fluids" defaultValue={record?.partsFluids} />
<BooleanInput source="wheelsTires" label="Wheels & Tires" defaultValue={record?.wheelsTires} />
<BooleanInput source="accessories" label="Accessories" defaultValue={record?.accessories} />
<BooleanInput source="subframe" label="Subframe" defaultValue={record?.subframe} />
<BooleanInput source="bumpers" label="Bumpers" defaultValue={record?.bumpers} />
<BooleanInput source="topSellers" label="Top Sellers" defaultValue={record?.topSellers} />
<BooleanInput source="freeShipping" label="Free Shipping" defaultValue={record?.freeShipping} />

<h3>Swap Flags</h3>
<BooleanInput source="swapsToyota" label="Swaps Toyota" defaultValue={record?.swapsToyota} />
<BooleanInput source="swapsHonda" label="Swaps Honda" defaultValue={record?.swapsHonda} />
<BooleanInput source="swapsAcura" label="Swaps Acura" defaultValue={record?.swapsAcura} />
<BooleanInput source="swapsScion" label="Swaps Scion" defaultValue={record?.swapsScion} />
<BooleanInput source="swapsLexus" label="Swaps Lexus" defaultValue={record?.swapsLexus} />
<BooleanInput source="swapsNissan" label="Swaps Nissan" defaultValue={record?.swapsNissan} />
<BooleanInput source="swapsSubaru" label="Swaps Subaru" defaultValue={record?.swapsSubaru} />
<BooleanInput source="swapsInfiniti" label="Swaps Infiniti" defaultValue={record?.swapsInfiniti} />




      <div style={{ margin: "1rem 0" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiUpload />
          Main Image:
        </label>
        <input type="file" accept="image/*" onChange={handleMainImageChange} />
      </div>

      <div style={{ margin: "1rem 0" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FiUpload />
          Thumbnails (up to 4):
        </label>
        {thumbnails.map((_, i) => (
          <input key={i} type="file" accept="image/*" onChange={(e) => handleThumbnailChange(i, e)} />
        ))}
      </div>

      <ArrayInput source="weights" label="Weights" defaultValue={record?.weights || []}>
        <SimpleFormIterator>
          <TextInput source="label" label="Label" />
          <NumberInput source="price" label="Price ($)" />
        </SimpleFormIterator>
      </ArrayInput>

      {category.toLowerCase().includes("seeds") && (
        <ArrayInput source="seeds" label="Seeds" defaultValue={record?.seeds || []}>
          <SimpleFormIterator>
            <TextInput source="label" label="Label" />
            <NumberInput source="price" label="Price ($)" />
          </SimpleFormIterator>
        </ArrayInput>
      )}

      <h3>SEO Metadata</h3>
      {["seoTitle", "seoDescription", "seoKeywords"].map((field) =>
        languages.map((lang) => (
          <TextInput
            key={`${field}-${lang}`}
            source={`${field}.${lang}`}
            label={`${field.replace("seo", "SEO ")} (${lang.toUpperCase()})`}
            defaultValue={record?.[field]?.[lang] || ""}
            onChange={(e) => handleInputChange(field, lang, e.target.value)}
            fullWidth
          />
        ))
      )}
    </SimpleForm>
  );
};

export const ProductEdit: React.FC = () => {
  return (
    <Edit>
      <ProductEditForm />
    </Edit>
  );
};
