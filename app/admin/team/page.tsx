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

interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string | null;
  imageUrl: string | null;
  socialLinks: { twitter?: string; linkedin?: string; github?: string; website?: string } | null;
  order: number;
  isActive: boolean;
}

const departments = ["Software Development", "Design", "Research", "Management", "Marketing", "Co-Founder"];

export default function TeamPage() {
  const [items, setItems] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editItem, setEditItem] = useState<Partial<TeamMember> | null>(null);
  const [isNew, setIsNew] = useState(false);

  const load = () => { setLoading(true); api.get<TeamMember[]>("/team-members").then(setItems).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const openNew = () => { setIsNew(true); setEditItem({ name: "", role: "", department: "Research", bio: "", imageUrl: "", socialLinks: {}, order: 0, isActive: true }); };
  const openEdit = (item: TeamMember) => { setIsNew(false); setEditItem({ ...item, socialLinks: { ...(item.socialLinks || {}) } }); };

  const handleSave = async () => {
    if (!editItem) return;
    try {
      if (isNew) { await api.post("/team-members", editItem); toast.success("Created"); }
      else { await api.put(`/team-members/${editItem.id}`, editItem); toast.success("Updated"); }
      setEditItem(null); load();
    } catch (err: any) { toast.error(err.message); }
  };

  const handleDelete = async (item: TeamMember) => {
    if (!confirm(`Delete "${item.name}"?`)) return;
    try { await api.delete(`/team-members/${item.id}`); toast.success("Deleted"); load(); }
    catch (err: any) { toast.error(err.message); }
  };

  const columns: Column<TeamMember>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "role", label: "Role", sortable: true },
    { key: "department", label: "Department", sortable: true },
    { key: "order", label: "Order", sortable: true },
    { key: "isActive", label: "Active", render: (item) => item.isActive ? "Yes" : "No" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
        <p className="text-muted-foreground">Manage the team page</p>
      </div>
      <DataTable columns={columns} data={items} onEdit={openEdit} onDelete={handleDelete} onCreate={openNew} createLabel="Add Member" searchKeys={["name", "role", "department"]} loading={loading} />
      <Dialog open={!!editItem} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>{isNew ? "New Team Member" : "Edit Team Member"}</DialogTitle></DialogHeader>
          {editItem && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Name</Label><Input value={editItem.name || ""} onChange={(e) => setEditItem({ ...editItem, name: e.target.value })} /></div>
                <div className="space-y-2"><Label>Role</Label><Input value={editItem.role || ""} onChange={(e) => setEditItem({ ...editItem, role: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Department</Label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={editItem.department || ""} onChange={(e) => setEditItem({ ...editItem, department: e.target.value })}>
                  {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="space-y-2"><Label>Bio</Label><Textarea value={editItem.bio || ""} onChange={(e) => setEditItem({ ...editItem, bio: e.target.value })} rows={3} /></div>
              <FileUpload label="Photo" value={editItem.imageUrl || ""} onChange={(url) => setEditItem({ ...editItem, imageUrl: url })} />
              <div className="space-y-2"><Label>LinkedIn URL</Label><Input value={editItem.socialLinks?.linkedin || ""} onChange={(e) => setEditItem({ ...editItem, socialLinks: { ...editItem.socialLinks, linkedin: e.target.value } })} /></div>
              <div className="space-y-2"><Label>Twitter URL</Label><Input value={editItem.socialLinks?.twitter || ""} onChange={(e) => setEditItem({ ...editItem, socialLinks: { ...editItem.socialLinks, twitter: e.target.value } })} /></div>
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
