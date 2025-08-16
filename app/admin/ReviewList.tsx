// ReviewList.tsx
"use client";

import React from "react";
import { List, Datagrid, TextField, DateField,EditButton,DeleteButton, NumberField } from "react-admin";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css"; // Import styles

const ReviewList: React.FC = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField label="Customer Name" source="customerName" />
        <TextField label="Content" source="reviewContent" />

        {/* Display Rating as Stars */}
        <NumberField label="Rating (Number)" source="rating" />
        <RatingField />

        <DateField label="Date" source="createdAt" />
        <EditButton />
                  <DeleteButton />
      </Datagrid>
    </List>
  );
};

// Custom component to display stars
const RatingField = ({ record }: { record?: { rating?: number } }) => {
  return (
    <Rating value={record?.rating || 0} readOnly style={{ maxWidth: 120 }} />
  );
};

export default ReviewList;