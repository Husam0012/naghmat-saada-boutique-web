
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordSettings from "./PasswordSettings";
import ContactSettings from "./ContactSettings";
import BrandingSettings from "./BrandingSettings";

const SettingsManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("password");
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">إعدادات المتجر</h2>
        <p className="text-muted-foreground mt-2">إدارة إعدادات متجرك وحسابك</p>
      </div>
      
      <Tabs
        defaultValue="password"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="password">كلمة المرور</TabsTrigger>
          <TabsTrigger value="contact">معلومات الاتصال</TabsTrigger>
          <TabsTrigger value="branding">العلامة التجارية</TabsTrigger>
        </TabsList>
        
        <TabsContent value="password" className="space-y-4">
          <PasswordSettings />
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4">
          <ContactSettings />
        </TabsContent>
        
        <TabsContent value="branding" className="space-y-4">
          <BrandingSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;
