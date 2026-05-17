"use client";

import { useState, useEffect } from "react";
import { DataTable, Column } from "@/components/data-table";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsersPage() {
  const [items, setItems] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNew, setIsNew] = useState(false);
  const [editItem, setEditItem] = useState<Partial<User> | null>(null);
  const [passwordItem, setPasswordItem] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const load = () => {
    setLoading(true);
    api.get<User[]>("/auth/users").then(setItems).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setIsNew(true);
    setName("");
    setEmail("");
    setPassword("");
    setEditItem({});
  };

  const handleCreate = async () => {
    try {
      await api.post("/auth/users", { name, email, password });
      toast.success("User created");
      setEditItem(null);
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordItem || !newPassword) return;
    try {
      await api.put("/auth/users/password", { userId: passwordItem.id, password: newPassword });
      toast.success("Password changed");
      setPasswordItem(null);
      setNewPassword("");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (item: User) => {
    if (!confirm(`Delete user "${item.name}" (${item.email})?`)) return;
    try {
      await api.delete(`/auth/users/${item.id}`);
      toast.success("User deleted");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const columns: Column<User>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    {
      key: "role",
      label: "Role",
      render: (item) => <Badge variant={item.role === "ADMIN" ? "default" : "outline"}>{item.role}</Badge>,
    },
    { key: "createdAt", label: "Created", render: (item) => formatDate(item.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage admin users and credentials</p>
      </div>

      <DataTable
        columns={columns}
        data={items}
        onDelete={handleDelete}
        onCreate={openNew}
        createLabel="Add User"
        searchKeys={["name", "email"]}
        searchable
        loading={loading}
        extraActions={(item) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setPasswordItem(item); setNewPassword(""); }}
          >
            Change Password
          </Button>
        )}
      />

      {/* Create User Dialog */}
      <Dialog open={!!editItem && isNew} onOpenChange={(o) => !o && setEditItem(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>New User</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" type="email" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" type="password" />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
              <Button onClick={handleCreate} disabled={!name || !email || !password}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={!!passwordItem} onOpenChange={(o) => { if (!o) { setPasswordItem(null); setNewPassword(""); } }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Change Password</DialogTitle></DialogHeader>
          {passwordItem && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Changing password for <strong>{passwordItem.name}</strong> ({passwordItem.email})
              </p>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  type="password"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setPasswordItem(null); setNewPassword(""); }}>Cancel</Button>
                <Button onClick={handleChangePassword} disabled={newPassword.length < 6}>Save</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
