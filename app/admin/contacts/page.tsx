"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/data-table";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateShort } from "@/lib/utils";

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function ContactsPage() {
  const [items, setItems] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get<{ items: Contact[]; pagination: any }>("/contacts")
      .then((r) => setItems(r.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleMarkRead = async (item: Contact) => {
    try {
      await api.put(`/contacts/${item.id}/read`);
      toast.success("Marked as read");
      load();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (item: Contact) => {
    if (!confirm(`Delete message from "${item.name}"?`)) return;
    try { await api.delete(`/contacts/${item.id}`); toast.success("Deleted"); load(); }
    catch (err: any) { toast.error(err.message); }
  };

  const columns: Column<Contact>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject", render: (item) => item.subject || "-" },
    {
      key: "message",
      label: "Message",
      render: (item) => (
        <span className="truncate block max-w-[250px] text-muted-foreground">
          {item.message}
        </span>
      ),
    },
    {
      key: "isRead",
      label: "Status",
      render: (item) =>
        item.isRead ? (
          <Badge variant="secondary">Read</Badge>
        ) : (
          <Badge>Unread</Badge>
        ),
    },
    {
      key: "createdAt",
      label: "Date",
      sortable: true,
      render: (item) => formatDateShort(item.createdAt),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Contact Submissions</h1>
        <p className="text-muted-foreground">Messages submitted through the contact form</p>
      </div>
      <DataTable
        columns={columns}
        data={items}
        onEdit={handleMarkRead}
        onDelete={handleDelete}
        searchKeys={["name", "email", "subject", "message"]}
        loading={loading}
      />
    </div>
  );
}
