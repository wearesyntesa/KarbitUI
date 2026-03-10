import React from "react";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

interface InstallTabsProps {
  /** The package name to install */
  packageName?: string;
}

export function InstallTabs({ packageName = "@wearesyntesa/karbit-ui" }: InstallTabsProps): React.ReactElement {
  return (
    <Tabs groupId="package-manager" defaultValue="pnpm">
      <TabItem value="pnpm" label="pnpm">
        <CodeBlock language="bash">{`pnpm add ${packageName}`}</CodeBlock>
      </TabItem>
      <TabItem value="npm" label="npm">
        <CodeBlock language="bash">{`npm install ${packageName}`}</CodeBlock>
      </TabItem>
      <TabItem value="yarn" label="yarn">
        <CodeBlock language="bash">{`yarn add ${packageName}`}</CodeBlock>
      </TabItem>
    </Tabs>
  );
}
