import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  FunctionField,
  ShowProps,
} from "react-admin";
import { useLanguage } from "@/app/context/LanguageContext";

const BlogPostShow: React.FC<ShowProps> = (props) => {
  const { language: currentLang = "en" } = useLanguage();

  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="author" label="Author" />
        <TextField source="category" label="Category" />

        <FunctionField
          label="Title"
          render={(record: any) =>
            record?.title?.[currentLang] || record?.title?.en || ""
          }
        />
        <FunctionField
          label="Content"
          render={(record: any) =>
            record?.content?.[currentLang] || record?.content?.en || ""
          }
        />
        <FunctionField
          label="Meta Title"
          render={(record: any) =>
            record?.metaTitle?.[currentLang] || record?.metaTitle?.en || ""
          }
        />
        <FunctionField
          label="Meta Description"
          render={(record: any) =>
            record?.metaDescription?.[currentLang] || record?.metaDescription?.en || ""
          }
        />

        <DateField source="createdAt" label="Created At" />
      </SimpleShowLayout>
    </Show>
  );
};

export default BlogPostShow;
