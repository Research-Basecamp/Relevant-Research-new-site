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
import { FileUpload } from "@/components/file-upload";

interface FeaturedIn {
  id: string;
  name: string;
  displayName: string;
  url: string;
  logoUrl: string | null;
  colorsFrom: string;
  colorsTo: string;
  textSize: string;
  width: string;
  description: string | null;
  order: number;
  isActive: boolean;
}

export default function FeaturedInPage() {
  const [items, setItems] = useState<FeaturedIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<FeaturedIn> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = () => { setLoading(true); api.get<FeaturedIn[]>("/featured-in").then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setIsNew(true); setEditItem({ name: "", displayName: "", url: "", order: 0, isActive: true }); };
  const openEdit = (item: FeaturedIn) => { setIsNew(false); setEditItem({ ...item }); };

  const handleSave = async () => {
    if (!editItem) return;
    try {
      if (isNew) { await api.post("/featured-in", editItem); toast.success("Created"); }
      else { await api.put(`/featured-in/${editItem.id}`, editItem); toast.success("Updated"); }
      setEditItem(null); load();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (item: FeaturedIn) => {
    if (!confirm(`Delete "${item.displayName}"?`)) return;
    try { await api.delete(`/featured-in/${item.id}`); toast.success("Deleted"); load(); }
    catch (err: any) { toast.error(err.message); }
  };

  const columns: Column<FeaturedIn>[] = [
    { key: "displayName", label: "Name", sortable: true },
    { key: "url", label: "URL", render: (item) => <span className="text-xs text-muted-foreground truncate block max-w-[200px]">{item.url}</span> },
    { key: "order", label: "Order", sortable: true },
    { key: "isActive", label: "Active", render: (item) => item.isActive ? "Yes" : "No" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Featured In</h1>
        <p className="text-muted-foreground">Media outlets where Relevant Research has been featured</p>
      </div>
      <DataTable columns={columns} data={items} onEdit={openEdit} onDelete={handleDelete} onCreate={openNew} createLabel="Add Media Outlet" searchKeys={["displayName", "name"]} loading={loading} />
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{isNew ? "New Media Outlet" : "Edit Media Outlet"}</DialogTitle></DialogHeader>
          {editItem && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Name</Label><Input value={editItem.name || ""} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Display Name</Label><Input value={editItem.displayName || ""} onChange={(e) => setEditItem({ ...editItem, displayName: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>URL</Label><Input value={editItem.url || ""} onChange={(e) => setEditItem({ ...editItem, url: e.target.value })} /></div>
              <FileUpload label="Logo" value={editItem.logoUrl || ""} onChange={(url) => setEditItem({ ...editItem, logoUrl: url })} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Color From</Label><Input value={editItem.colorsFrom || ""} onChange={(e) => setEditItem({ ...editItem, colorsFrom: e.target.value })} /></div>
                <div className="space-y-2"><Label>Color To</Label><Input value={editItem.colorsTo || ""} onChange={(e) => setEditItem({ ...editItem, colorsTo: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Text Size</Label><Input value={editItem.textSize || ""} onChange={(e) => setEditItem({ ...editItem, textSize: e.target.value })} /></div>
                <div className="space-y-2"><Label>Width</Label><Input value={editItem.width || ""} onChange={(e) => setEditItem({ ...editItem, width: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={editItem.description || ""} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} /></div>
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
