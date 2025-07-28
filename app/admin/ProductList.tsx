"use client";
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  BooleanField,
  Filter,
  TextInput,
  BooleanInput,
  DeleteButton,
  EditButton,
  ShowButton,
  FunctionField,
  ImageField,
} from "react-admin";

// ✅ Use FunctionField instead of a custom component if you just want to display custom logic
const ProductNameField = () => (
  <FunctionField
    label="Name (EN)"
    render={(record: any) => record?.name?.en || ""}
  />
);

const ProductFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search Name (EN)" source="name.en" alwaysOn />
    <TextInput label="Category" source="category" />
    <ImageField source="mainImage" label="Image" sx={{ width: 80, height: 80 }} />
    <BooleanInput label="Toyota" source="toyota" />
    <BooleanInput label="Honda" source="honda" />
    <BooleanInput label="Nissan" source="nissan" />
  </Filter>
);

export const ProductList = (props: any) => (
  <List
    filters={<ProductFilter />}
    {...props}
    perPage={25}
    sort={{ field: "name.en", order: "ASC" }}
  >
    <Datagrid>
      <ProductNameField />
      <NumberField source="price" label="Price ($)" />
      <TextField source="category" />
      
      <BooleanField source="popularProduct" label="Popular" />
      <BooleanField source="isPublished" label="Published" />
      <ShowButton />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);
