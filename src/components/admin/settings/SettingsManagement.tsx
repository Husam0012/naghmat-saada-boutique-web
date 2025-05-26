
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PasswordSettings from "./PasswordSettings";
import UsernameSettings from "./UsernameSettings";
import ContactSettings from "./ContactSettings";

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
          <TabsTrigger value="username">اسم المستخدم</TabsTrigger>
          <TabsTrigger value="contact">معلومات الاتصال</TabsTrigger>
        </TabsList>
        
        <TabsContent value="password" className="space-y-4">
          <PasswordSettings />
        </TabsContent>
        
        <TabsContent value="username" className="space-y-4">
          <UsernameSettings />
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4">
          <ContactSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;
