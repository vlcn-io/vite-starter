import { CtxAsync, useQuery } from "@vlcn.io/react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import vlcnLogo from "./assets/vlcn.png";
import "./App.css";
import randomWords from "./support/randomWords.js";
import { DBAsync } from "@vlcn.io/xplat-api";

type TestRecord = { id: string; name: string };
const wordOptions = { exactly: 3, join: " " };

function App({ ctx }: { ctx: CtxAsync }) {
  const data = useQuery<TestRecord>(
    ctx,
    "SELECT * FROM test ORDER BY id DESC"
  ).data;

  const addData = () => {
    ctx.db.exec("INSERT INTO test (id, name) VALUES (?, ?);", [
      nanoid(10),
      randomWords(wordOptions) as string,
    ]);
  };

  const dropData = () => {
    ctx.db.exec("DELETE FROM test;");
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://vlcn.io" target="_blank">
          <img src={vlcnLogo} className="logo vlcn" alt="Vulcan logo" />
        </a>
      </div>
      <h1>Vite + React + Vulcan</h1>
      <div className="card">
        <button onClick={addData} style={{ marginRight: 24 }}>
          Add Data
        </button>
        <button onClick={dropData}>Drop Data</button>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>
                  <EditableItem db={ctx.db} id={row.id} value={row.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite, React and Vulcan logos to learn more
      </p>
    </>
  );
}

function EditableItem({
  db,
  id,
  value,
}: {
  db: DBAsync;
  id: string;
  value: string;
}) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    db.exec("UPDATE test SET name = ? WHERE id = ?;", [e.target.value, id]);

  return <input type="text" value={value} onChange={onChange} />;
}

export default App;

const nanoid = (t = 21) =>
  crypto
    .getRandomValues(new Uint8Array(t))
    .reduce(
      (t, e) =>
        (t +=
          (e &= 63) < 36
            ? e.toString(36)
            : e < 62
            ? (e - 26).toString(36).toUpperCase()
            : e > 62
            ? "-"
            : "_"),
      ""
    );
