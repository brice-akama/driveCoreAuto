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
      {/* Multilingual names */}
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

      {/* Brand Flags */}
      <BooleanField source="toyota" />
      <BooleanField source="acura" />
      <BooleanField source="mercedes" />
      <BooleanField source="honda" />
      <BooleanField source="lexus" />
      <BooleanField source="infiniti" />
      <BooleanField source="subaru" />
      <BooleanField source="nissan" />

      {/* Transmission Flags */}
      <h3>Transmission Flags</h3>
      <BooleanField source="transmissionsToyotaAutomatic" label="Toyota Automatic" />
      <BooleanField source="transmissionsToyotaManuel" label="Toyota Manual" />
      <BooleanField source="transmissionsHondataAutomatic" label="Honda Automatic" />
      <BooleanField source="transmissionsHondaaManuel" label="Honda Manual" />
      <BooleanField source="transmissionsAcuretaAutomatic" label="Acura Automatic" />
      <BooleanField source="transmissionsAcureaManuel" label="Acura Manual" />
      <BooleanField source="transmissionsInfinitAutomatic" label="Infiniti Automatic" />
      <BooleanField source="transmissionsInfinitManuel" label="Infiniti Manual" />
      <BooleanField source="transmissionsSaburaAutomatic" label="Subaru Automatic" />
      <BooleanField source="transmissionsSaburaManuel" label="Subaru Manual" />
      <BooleanField source="transmissionsScionAutomatic" label="Scion Automatic" />
      <BooleanField source="transmissionScionburaManuel" label="Scion Manual" />
      <BooleanField source="transmissionsNissanAutomatic" label="Nissan Automatic" />
      <BooleanField source="transmissionNissanburaManuel" label="Nissan Manual" />
      <BooleanField source="transmissionsLexusAutomatic" label="Lexus Automatic" />
      <BooleanField source="transmissionLexuxburaManuel" label="Lexus Manual" />
      <h3>Product Type Flags</h3>
<BooleanField source="partsFluids" label="Parts & Fluids" />
<BooleanField source="wheelsTires" label="Wheels & Tires" />
<BooleanField source="accessories" label="Accessories" />
<BooleanField source="subframe" label="Subframe" />
<BooleanField source="bumpers" label="Bumpers" />
<BooleanField source="topSellers" label="Top Sellers" />
<BooleanField source="freeShipping" label="Free Shipping" />
<h3>Swap Compatibility</h3>
<BooleanField source="swapsToyota" label="Swaps Toyota" />
<BooleanField source="swapsHonda" label="Swaps Honda" />
<BooleanField source="swapsAcura" label="Swaps Acura" />
<BooleanField source="swapsScion" label="Swaps Scion" />
<BooleanField source="swapsLexus" label="Swaps Lexus" />
<BooleanField source="swapsNissan" label="Swaps Nissan" />
<BooleanField source="swapsSubaru" label="Swaps Subaru" />
<BooleanField source="swapsInfiniti" label="Swaps Infiniti" />



      {/* Multilingual Fields */}
      {["description", "Specifications", "Shipping", "Warranty"].flatMap((field) =>
        languages.map((lang) => (
          <TextField
            key={`${field}_${lang}`}
            source={`${field}.${lang}`}
            label={`${field} (${lang.toUpperCase()})`}
          />
        ))
      )}

      {/* SEO Fields */}
      {seoFields.flatMap((field) =>
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

      {/* Seeds */}
      <ArrayField source="seeds" label="Seeds">
        <SingleFieldList>
          <ChipField source="label" />
        </SingleFieldList>
      </ArrayField>

      {/* Images */}
      <ImageField source="mainImage" label="Main Image" />
      <ArrayField source="thumbnails" label="Thumbnails">
        <SingleFieldList>
          <ImageField source="" />
        </SingleFieldList>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
