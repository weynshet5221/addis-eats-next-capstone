import MenuSkeleton from "../../components/MenuSkeleton";

export default function MenuLoading() {
  return (
    <main className="page-container">
      <div className="page-heading">
        <h1>Our menu</h1>
        <p>Loading delicious choices...</p>
      </div>
      <MenuSkeleton />
    </main>
  );
}