"use client";

import { Tabs, Tab } from "@heroui/react";

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <Tabs aria-label="Settings tabs" color="primary" variant="underlined">
        <Tab key="connections" title="Connections">
          <div className="py-4">
            <h2 className="text-lg font-semibold mb-4">Connections</h2>
            <div className="space-y-4">
              <p className="text-gray-600">
                Manage your social media connections and integrations.
              </p>
              {/* Connections settings content will go here */}
            </div>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
