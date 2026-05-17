"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface Settings {
  [key: string]: any;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get<Settings>("/site-settings")
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  const update = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const entries = Object.entries(settings).map(([key, value]) => ({ key, value }));
      await api.put("/site-settings", entries);
      toast.success("Settings saved");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  const fields = [
    { key: "siteName", label: "Site Name", type: "text" },
    { key: "tagline", label: "Tagline", type: "text" },
    { key: "paginationLimit", label: "Pagination Limit", type: "number" },
    { key: "siteUrl", label: "Site URL", type: "url" },
    { key: "contactEmail", label: "Contact Email", type: "email" },
    { key: "seoTitleTemplate", label: "SEO Title Template", type: "text" },
    { key: "seoDescription", label: "SEO Description", type: "textarea" },
    { key: "ogImage", label: "OG Image URL", type: "text" },
    { key: "heroTitle", label: "Hero Title", type: "text" },
    { key: "heroSubtitle", label: "Hero Subtitle", type: "text" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-muted-foreground">Global configuration for your site</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Saving...</>
          ) : (
            <><Save className="h-4 w-4 mr-2" /> Save All</>
          )}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {fields.map((field) => (
          <Card key={field.key}>
            <CardHeader>
              <CardTitle className="text-sm font-medium">{field.label}</CardTitle>
            </CardHeader>
            <CardContent>
              {field.type === "textarea" ? (
                <textarea
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={settings[field.key] || ""}
                  onChange={(e) => update(field.key, e.target.value)}
                />
              ) : (
                <Input
                  type={field.type}
                  value={settings[field.key] || ""}
                  onChange={(e) => update(field.key, field.type === "number" ? parseInt(e.target.value) || 0 : e.target.value)}
                />
              )}
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["twitter", "linkedin", "instagram"].map((platform) => (
              <div key={platform} className="space-y-1">
                <Label className="text-xs capitalize">{platform}</Label>
                <Input
                  value={settings.socialLinks?.[platform] || ""}
                  onChange={(e) =>
                    update("socialLinks", {
                      ...(settings.socialLinks || {}),
                      [platform]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
