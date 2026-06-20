"use client";

import { useState } from "react";
import { Check, KeyRound, User as UserIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/layout/page-header";
import { FormField } from "@/components/forms/form-field";
import { useAuth } from "@/lib/auth-context";
import { getInitials } from "@/lib/utils";

function formatDate(value: string | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(value)
  );
}

export default function ProfilePage() {
  const { user, updateDisplayName, changePassword } = useAuth();

  const [name, setName] = useState(user?.displayName ?? "");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const hasPasswordProvider = user?.providerData.some((p) => p.providerId === "password") ?? false;

  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameSaving(true);
    setNameError(null);
    try {
      await updateDisplayName(name);
      setNameSaved(true);
      setTimeout(() => setNameSaved(false), 1800);
    } catch (err) {
      setNameError(err instanceof Error ? err.message : "Could not update name. Please try again.");
    } finally {
      setNameSaving(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordSaving(true);
    try {
      await changePassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 1800);
    } catch (err) {
      if (err instanceof Error && err.message.includes("requires-recent-login")) {
        setPasswordError("This action requires a recent sign-in. Please log out and sign in again, then retry.");
      } else {
        setPasswordError(err instanceof Error ? err.message : "Could not update password. Please try again.");
      }
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your personal account details" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Personal Information</CardTitle>
          <CardDescription>Your name and email associated with this account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="text-base">
                {getInitials(user?.displayName || user?.email || "U")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{user?.displayName || "No name set"}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Full Name" htmlFor="profile-name" required>
                <Input id="profile-name" value={name} onChange={(e) => setName(e.target.value)} required />
              </FormField>
              <FormField label="Email" htmlFor="profile-email">
                <Input id="profile-email" value={user?.email ?? ""} disabled />
              </FormField>
            </div>

            {nameError && <p className="text-sm text-destructive">{nameError}</p>}

            <div className="flex justify-end">
              <Button type="submit" disabled={nameSaving} className="gap-1.5">
                {nameSaved ? (
                  <>
                    <Check className="size-4" />
                    Saved
                  </>
                ) : nameSaving ? (
                  "Saving…"
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {hasPasswordProvider && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold">Change Password</CardTitle>
              <KeyRound className="size-4 text-muted-foreground" />
            </div>
            <CardDescription>Update the password used to sign in</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="New Password" htmlFor="profile-new-password" required>
                  <Input
                    id="profile-new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </FormField>
                <FormField label="Confirm Password" htmlFor="profile-confirm-password" required>
                  <Input
                    id="profile-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </FormField>
              </div>

              {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}

              <div className="flex justify-end">
                <Button type="submit" disabled={passwordSaving} className="gap-1.5">
                  {passwordSaved ? (
                    <>
                      <Check className="size-4" />
                      Updated
                    </>
                  ) : passwordSaving ? (
                    "Updating…"
                  ) : (
                    "Update password"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-semibold">Account</CardTitle>
            <UserIcon className="size-4 text-muted-foreground" />
          </div>
          <CardDescription>Account activity and sign-in details</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-3">
          <div>
            <p className="text-muted-foreground">Member since</p>
            <p className="font-medium">{formatDate(user?.metadata.creationTime)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Last sign-in</p>
            <p className="font-medium">{formatDate(user?.metadata.lastSignInTime)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Sign-in method</p>
            <p className="font-medium">{hasPasswordProvider ? "Email & password" : "Google"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
