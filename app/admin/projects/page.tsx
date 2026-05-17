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
import { FileUpload } from "@/components/file-upload";

interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  link: string | null;
  status: string;
  year: string | null;
  order: number;
  isActive: boolean;
}

export default function ProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<Project> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = () => { setLoading(true); api.get<Project[]>("/projects").then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setIsNew(true); setEditItem({ title: "", description: "", shortDescription: "", image: "", status: "live", order: 0, isActive: true }); };
  const openEdit = (item: Project) => { setIsNew(false); setEditItem({ ...item }); };

  const handleSave = async () => {
    if (!editItem) return;
    try {
      if (isNew) { await api.post("/projects", editItem); toast.success("Created"); }
      else { await api.put(`/projects/${editItem.id}`, editItem); toast.success("Updated"); }
      setEditItem(null); load();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (item: Project) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    try { await api.delete(`/projects/${item.id}`); toast.success("Deleted"); load(); }
    catch (err: any) { toast.error(err.message); }
  };

  const columns: Column<Project>[] = [
    { key: "title", label: "Title", sortable: true },
    { key: "status", label: "Status", render: (item) => <Badge variant="outline">{item.status}</Badge> },
    { key: "year", label: "Year", sortable: true },
    { key: "isActive", label: "Active", render: (item) => item.isActive ? "Yes" : "No" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">Manage portfolio projects shown on the site</p>
      </div>
      <DataTable columns={columns} data={items} onEdit={openEdit} onDelete={handleDelete} onCreate={openNew} createLabel="Add Project" searchKeys={["title"]} loading={loading} />
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{isNew ? "New Project" : "Edit Project"}</DialogTitle></DialogHeader>
          {editItem && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2"><Label>Title</Label><Input value={editItem.title || ""} onChange={(e) => setEditItem({ ...editItem, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Short Description</Label><Textarea value={editItem.shortDescription || ""} onChange={(e) => setEditItem({ ...editItem, shortDescription: e.target.value })} rows={2} /></div>
              <div className="space-y-2"><Label>Full Description</Label><Textarea value={editItem.description || ""} onChange={(e) => setEditItem({ ...editItem, description: e.target.value })} rows={4} /></div>
              <FileUpload label="Project Image" value={editItem.image || ""} onChange={(url) => setEditItem({ ...editItem, image: url || "" })} />
              <div className="space-y-2"><Label>Project URL</Label><Input value={editItem.link || ""} onChange={(e) => setEditItem({ ...editItem, link: e.target.value })} /></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2"><Label>Year</Label><Input value={editItem.year || ""} onChange={(e) => setEditItem({ ...editItem, year: e.target.value })} /></div>
                <div className="space-y-2"><Label>Status</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editItem.status || "live"} onChange={(e) => setEditItem({ ...editItem, status: e.target.value })}>
                    <option value="live">Live</option><option value="in-development">In Development</option><option value="completed">Completed</option>
                  </select>
                </div>
                <div className="space-y-2"><Label>Order</Label><Input type="number" value={editItem.order || 0} onChange={(e) => setEditItem({ ...editItem, order: parseInt(e.target.value) || 0 })} /></div>
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
