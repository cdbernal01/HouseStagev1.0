import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Bienvenido a HouseStage',
  description: 'Sitio de ventas en linea de todo tipo de herramientas para construcción',
  keywords: 'construcción, herramientas, herramientas eléctricas',
};

export default Meta;
