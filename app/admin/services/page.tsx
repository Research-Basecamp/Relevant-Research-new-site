"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/data-table";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  features: string[];
  order: number;
  isActive: boolean;
}

export default function ServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<Service> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = () => { setLoading(true); api.get<Service[]>("/services").then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setIsNew(true); setEditItem({ title: "", description: "", iconName: "Code2", features: [], order: 0, isActive: true }); };
  const openEdit = (item: Service) => { setIsNew(false); setEditItem({ ...item, features: [...item.features] }); };

  const handleSave = async () => {
    if (!editItem) return;
    try {
      if (isNew) { await api.post("/services", editItem); toast.success("Created"); }
      else { await api.put(`/services/${editItem.id}`, editItem); toast.success("Updated"); }
      setEditItem(null); load();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (item: Service) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    try { await api.delete(`/services/${item.id}`); toast.success("Deleted"); load(); }
    catch (err: any) { toast.error(err.message); }
  };

  const columns: Column<Service>[] = [
    { key: "title", label: "Title", sortable: true },
    { key: "iconName", label: "Icon" },
    { key: "order", label: "Order", sortable: true },
    { key: "isActive", label: "Active", render: (item) => item.isActive ? "Yes" : "No" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Services</h1>
        <p className="text-muted-foreground">Manage service offerings displayed on the site</p>
      </div>
      <DataTable columns={columns} data={items} onEdit={openEdit} onDelete={handleDelete} onCreate={openNew} createLabel="Add Service" searchKeys={["title"]} loading={loading} />
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{isNew ? "New Service" : "Edit Service"}</DialogTitle></DialogHeader>
          {editItem && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2"><Label>Title</Label><Input value={editItem.title || ""} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={editItem.description || ""} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} rows={3} /></div>
              <div className="space-y-2"><Label>Icon Name (lucide-react)</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editItem.iconName || "Code2"} onChange={(e) => setEditItem({ ...editItem, iconName: e.target.value })}>
                  <option value="Code2">Code2</option><option value="Database">Database</option><option value="Users">Users</option><option value="Globe">Globe</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Features (one per line)</Label>
                <Textarea
                  value={(editItem.features || []).join("\n")}
                  onChange={(e) => setEditItem({ ...editItem, features: e.target.value.split("\n").filter(Boolean) })}
                  rows={5}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Order</Label><Input type="number" value={editItem.order || 0} onChange={(e) => setEditItem({ ...editItem, order: parseInt(e.target.value) || 0 })} /></div>
                <div className="space-y-2"><Label>Active</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editItem.isActive ? "true" : "false"} onChange={(e) => setEditItem({ ...editItem, isActive: e.target.value === "true" })}>
                    <option value="true">Yes</option><option value="false">No</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
