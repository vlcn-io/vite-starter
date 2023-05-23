export const endpoints = {
  createOrMigrate: updatePort(
    new URL("/sync/create-or-migrate", window.location.origin)
  ),
  applyChanges: updatePort(new URL("/sync/changes", window.location.origin)),
  startOutboundStream: updatePort(
    new URL("/sync/start-outbound-stream", window.location.origin)
  ),
};

function updatePort(u: URL) {
  if (import.meta.env.DEV) {
    u.port = "8080";
  }
  return u;
}
