"use client";
import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  useShowContext,
} from "react-admin";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

const ReviewShow: React.FC = () => {
  return (
    <Show>
      <ReviewShowContent />
    </Show>
  );
};

const ReviewShowContent = () => {
  const { record } = useShowContext();

  if (!record) return <div>Loading review...</div>;

  return (
    <SimpleShowLayout>
      <TextField source="customerName" label="Customer Name" />
      <TextField source="slug" label="Product Slug" />
      <TextField source="reviewContent" label="Review Content" />

      {/* Display location */}
      {record.location && (
        <TextField source="location" label="Location (State / Country)" />
      )}

      <div>
        <label style={{ fontWeight: "bold" }}>Rating</label>
        <div style={{ paddingTop: 4 }}>
          <Rating value={record.rating} readOnly style={{ maxWidth: 150 }} />
        </div>
      </div>

      <DateField source="date" label="Date Submitted" />
    </SimpleShowLayout>
  );
};

export default ReviewShow;
