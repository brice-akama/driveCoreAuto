"use client";
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  ImageField,
  ShowButton,
  EditButton,
  ListProps,
  DeleteButton,
} from "react-admin";

type Lang = "en" | "fr" | "es" | "de";

const CategoryList: React.FC<ListProps> = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <ImageField source="imageUrl" label="Image" />
        {(["en", "fr", "es", "de"] as Lang[]).map((lang) => (
          <TextField key={lang} source={`name.${lang}`} label={`Name (${lang})`} />
        ))}
        <EditButton />
        <DeleteButton />
        <ShowButton />
      </Datagrid>
    </List>
  );
};

export default CategoryList;
