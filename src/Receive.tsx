import { CtxAsync } from "@vlcn.io/react";

export default function Receive({ ctx }: { ctx: CtxAsync }) {
  // Check that we don't currently have this thing.
  const queryParams = window.location.search;
  console.log(queryParams);
  return <div></div>;
}
