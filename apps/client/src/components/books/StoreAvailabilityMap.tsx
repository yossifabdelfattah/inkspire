import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { getBookStores, type StoreAvailability } from '../../services/storeService';
import { useFetch } from '../../hooks/useFetch';
import * as S from './StoreAvailabilityMap.styled';

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface StoreAvailabilityMapProps {
  bookId: string;
}

const getDirectionsUrl = (lat: number, lng: number) =>
  `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

const StoreAvailabilityMap = ({ bookId }: StoreAvailabilityMapProps) => {
  const { data: stores, loading, error } = useFetch<StoreAvailability[]>(
    (signal) => getBookStores(bookId, signal),
    [bookId],
    [],
    'Failed to load store availability.'
  );

  if (loading) {
    return <S.EmptyState>Checking store availability…</S.EmptyState>;
  }

  if (error) {
    return <S.EmptyState role="alert">{error}</S.EmptyState>;
  }

  if (stores.length === 0) {
    return <S.EmptyState>No nearby stores currently have this book in stock.</S.EmptyState>;
  }

  const center: [number, number] = [stores[0].latitude, stores[0].longitude];

  return (
    <S.Wrapper>
      <S.MapWrapper>
        <MapContainer center={center} zoom={11} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {stores.map((store) => (
            <Marker key={store._id} position={[store.latitude, store.longitude]}>
              <Popup>
                <strong>{store.name}</strong>
                <br />
                {store.address}, {store.city}
                <br />
                {store.stock} in stock
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </S.MapWrapper>

      <S.StoreList>
        {stores.map((store) => (
          <S.StoreCard key={store._id}>
            <S.StoreInfo>
              <S.StoreName>{store.name}</S.StoreName>
              <span>
                {store.address}, {store.city}
              </span>
            </S.StoreInfo>
            <S.Actions>
              <S.StockBadge>{store.stock} in stock</S.StockBadge>
              <S.DirectionsLink
                href={getDirectionsUrl(store.latitude, store.longitude)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Directions
              </S.DirectionsLink>
            </S.Actions>
          </S.StoreCard>
        ))}
      </S.StoreList>
    </S.Wrapper>
  );
};

export default StoreAvailabilityMap;
