/* Renders the agency name with "Hi" in red and "Brands" in royal blue */
export default function BrandName({ name = 'HiBrands' }) {
  const i = name.indexOf('Brands');
  if (i <= 0) return name;
  return (
    <>
      <span className="brand-name__hi">{name.slice(0, i)}</span>
      <span className="brand-name__brands">{name.slice(i)}</span>
    </>
  );
}
