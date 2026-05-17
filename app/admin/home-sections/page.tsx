"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataTable, Column } from "@/components/data-table";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

interface HomeSection {
  id: string;
  type: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  content: any;
  order: number;
  isActive: boolean;
}

const defaultSection: Partial<HomeSection> = {
  type: "",
  title: "",
  subtitle: "",
  description: "",
  content: {},
  order: 0,
  isActive: true,
};

export default function HomeSectionsPage() {
  const [sections, setSections] = useState<HomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<HomeSection> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.get<HomeSection[]>("/site-settings/home-sections")
      .then(setSections)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openNew = () => {
    setIsNew(true);
    setEditItem({ ...defaultSection });
  };

  const openEdit = (item: HomeSection) => {
    setIsNew(false);
    setEditItem({ ...item });
  };

  const handleSave = async () => {
    if (!editItem) return;
    setSaving(true);
    try {
      if (isNew) {
        await api.post("/site-settings/home-sections", editItem);
        toast.success("Section created");
      } else {
        await api.put(`/site-settings/home-sections/${editItem.id}`, editItem);
        toast.success("Section updated");
      }
      setEditItem(null);
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: HomeSection) => {
    if (!confirm(`Delete "${item.type}" section?`)) return;
    try {
      await api.delete(`/site-settings/home-sections/${item.id}`);
      toast.success("Section deleted");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const columns: Column<HomeSection>[] = [
    { key: "type", label: "Type", sortable: true },
    {
      key: "title",
      label: "Title",
      sortable: true,
      render: (item) => item.title || "-",
    },
    {
      key: "order",
      label: "Order",
      sortable: true,
      render: (item) => item.order,
    },
    {
      key: "isActive",
      label: "Active",
      render: (item) => (item.isActive ? "Yes" : "No"),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Home Sections</h1>
        <p className="text-muted-foreground">Manage homepage sections and their content</p>
      </div>

      <DataTable
        columns={columns}
        data={sections}
        onEdit={openEdit}
        onDelete={handleDelete}
        onCreate={openNew}
        createLabel="Add Section"
        searchKeys={["type", "title"]}
        searchable
        loading={loading}
      />

      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isNew ? "New Section" : `Edit Section: ${editItem?.type}`}</DialogTitle>
          </DialogHeader>
          {editItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Input
                    value={editItem.type || ""}
                    onChange={(e) => setEditItem({ ...editItem, type: e.target.value })}
                    placeholder="e.g. hero, features, cta"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={editItem.title || ""}
                    onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={editItem.subtitle || ""}
                    onChange={(e) => setEditItem({ ...editItem, subtitle: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Order</Label>
                  <Input
                    type="number"
                    value={editItem.order ?? 0}
                    onChange={(e) => setEditItem({ ...editItem, order: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editItem.description || ""}
                  onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Active</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={editItem.isActive ? "true" : "false"}
                  onChange={(e) => setEditItem({ ...editItem, isActive: e.target.value === "true" })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Content (JSON)</Label>
                <Textarea
                  value={JSON.stringify(editItem.content || {}, null, 2)}
                  onChange={(e) => {
                    try { setEditItem({ ...editItem, content: JSON.parse(e.target.value) }); }
                    catch {}
                  }}
                  rows={8}
                  className="font-mono text-xs"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
