import React from "react";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  DeleteButton,
  ListProps,
  useRecordContext,
  ShowButton,
} from "react-admin";
import { useLanguage } from "@/app/context/LanguageContext";

const LANGUAGES = ["en", "de", "fr", "es"];

// Add optional props if you want, including label
const BlogTitleField: React.FC<{ label?: string }> = ({ label }) => {
  const record = useRecordContext();
  const { language: currentLang = "en" } = useLanguage();

  if (!record) return null;

  return (
    <span aria-label={label}>
      {record.title?.[currentLang] || record.title?.en || ""}
    </span>
  );
};

const BlogPostList: React.FC<ListProps> = (props) => (
  <List {...props} perPage={10}>
    {/* Removed pagination prop */}
    <Datagrid rowClick="edit">
      {/* Remove label or handle in component */}
      <BlogTitleField />
      <TextField source="author" />
      <TextField source="category" />
      <DateField source="createdAt" />
      <EditButton />
          <DeleteButton />
          <ShowButton />
    </Datagrid>
  </List>
);

export default BlogPostList;
