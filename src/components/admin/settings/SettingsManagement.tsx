
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BrandingSettings from "./BrandingSettings";
import UsernameSettings from "./UsernameSettings";
import PasswordSettings from "./PasswordSettings";

const SettingsManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">إعدادات المتجر</h1>
        <p className="text-muted-foreground">إدارة إعدادات المتجر والحساب</p>
      </div>

      <Tabs defaultValue="branding" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="branding">العلامة التجارية</TabsTrigger>
          <TabsTrigger value="username">اسم المستخدم</TabsTrigger>
          <TabsTrigger value="password">كلمة المرور</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-4">
          <BrandingSettings />
        </TabsContent>

        <TabsContent value="username" className="space-y-4">
          <UsernameSettings />
        </TabsContent>

        <TabsContent value="password" className="space-y-4">
          <PasswordSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManagement;
