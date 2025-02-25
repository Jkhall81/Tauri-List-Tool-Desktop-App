"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { useAppStore } from "./store/store";
import { Button } from "@/components/ui/button";
import { DirectorySelector } from "./Custom_Components/DirectorySelector";
import { SourceFileSelector } from "./Custom_Components/SourceFileSelector";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExtractPhoneNumbersButton } from "./Custom_Components/ExtractPhoneNumbersButton";
import { CreateFinalFileButton } from "./Custom_Components/CreateFinalFileButton";
import { CreateDNCFileButton } from "./Custom_Components/CreateDNCFileButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { activeTab, setActiveTab } = useAppStore();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <main className="w-full h-screen flex">
          <Tabs
            defaultValue="listProcessing"
            onValueChange={setActiveTab}
            className="w-[600px] p-4"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="listProcessing">List Processing</TabsTrigger>
              <TabsTrigger value="dncProcessing">DNC Processing</TabsTrigger>
              <TabsTrigger value="miscUtilites">MISC Utilities</TabsTrigger>
            </TabsList>

            {/* LIST PROCESSING TAB CONTENT */}
            <TabsContent value="listProcessing">
              <Card>
                <CardHeader>
                  <CardTitle>Work in Progress</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent className="space-y-2"></CardContent>
                <CardFooter></CardFooter>
              </Card>
            </TabsContent>

            {/* DNC PROCESSING CONTENT */}
            <TabsContent value="dncProcessing">
              <Card>
                <CardHeader>
                  <CardTitle>Source Directory</CardTitle>
                  <CardDescription>
                    Select the directory where all your source files will be
                    located.
                  </CardDescription>
                  <DirectorySelector />
                  <CardTitle className="pt-2">Source File</CardTitle>
                  <CardDescription>
                    Select your cleaned Source File
                    [Source_SRC_CAMPAIGN_DATE_#.csv]
                  </CardDescription>
                  <SourceFileSelector />
                </CardHeader>
                <CardHeader>
                  <CardTitle>DNC Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-2">
                  <ExtractPhoneNumbersButton />
                  <CreateFinalFileButton />
                  <CreateDNCFileButton />
                  <Button>Generate Email Report</Button>
                </CardContent>
                <CardFooter></CardFooter>
              </Card>
            </TabsContent>

            {/* MISC UTILITY CONTENT */}
            <TabsContent value="miscUtilites">
              <Card>
                <CardHeader>
                  <CardTitle>Work in Progress</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent className="space-y-2"></CardContent>
                <CardFooter></CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="w-full h-screen">{children}</div>
        </main>
      </body>
    </html>
  );
}
