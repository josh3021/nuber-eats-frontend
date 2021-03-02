import { gql, useMutation, useSubscription } from '@apollo/client';
import GoogleMapReact from 'google-map-react';
import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FULL_ORDER_FRAGMENT } from '../../graphql/fragments/orders';
import { CookedOrder } from '../../__generated__/CookedOrder';
import { TakeOrder, TakeOrderVariables } from '../../__generated__/TakeOrder';

interface ICoordsProps {
  latitude: number;
  longitude: number;
}

interface IDriverProps extends ICoordsProps {
  $hover?: any;
}

const TAKE_ORDER_MUTATION = gql`
  mutation TakeOrder($takeOrderInput: TakeOrderInput!) {
    takeOrder(input: $takeOrderInput) {
      result
      error
    }
  }
`;

const COOKED_ORDER_SUBSCRIPTION = gql`
  subscription CookedOrder {
    cookedOrder {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

const Driver: React.FC<IDriverProps> = ({ latitude, longitude, $hover }) => (
  <div className="text-lg">🚖</div>
);

function DashBoardPage() {
  const history = useHistory();
  const [driverCoords, setDriverCoords] = useState<ICoordsProps>({
    latitude: 0,
    longitude: 0,
  });
  const [
    driverAddress,
    setDriverAddress,
  ] = useState<google.maps.GeocoderResult>();
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();
  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    console.log(latitude, longitude);
    setDriverCoords({ latitude, longitude });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };
  const onCompleted = (data: TakeOrder) => {
    if (data.takeOrder.result) {
      history.push(`/order/${cookedOrdersData?.cookedOrder.id}`);
    }
  };
  const { data: cookedOrdersData } = useSubscription<CookedOrder>(
    COOKED_ORDER_SUBSCRIPTION,
  );
  const [takeOrderMutation] = useMutation<TakeOrder, TakeOrderVariables>(
    TAKE_ORDER_MUTATION,
    {
      onCompleted,
    },
  );
  const onGoogleApiLoaded = ({ map, maps }: { map: any; maps: any }) => {
    map.panTo(
      new google.maps.LatLng(driverCoords.latitude, driverCoords.longitude),
    );
    setMap(map);
    setMaps(maps);
  };
  const makeRoute = useCallback(() => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: '#000',
          strokeOpacity: 1,
          strokeWeight: 58,
        },
      });
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              37.40214407670418,
              126.99114499874791,
            ),
          },
          destination: {
            location: new google.maps.LatLng(
              37.47941125892112,
              126.87051484818844,
            ),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result) => {
          console.log(result);
          directionsRenderer.setDirections(result);
        },
      );
    }
  }, [map]);
  const triggerTakeOrderMutation = (orderId: string) => {
    takeOrderMutation({
      variables: {
        takeOrderInput: {
          id: orderId,
        },
      },
    });
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (cookedOrdersData?.cookedOrder.id) {
      makeRoute();
    }
  }, [cookedOrdersData, makeRoute]);
  useEffect(() => {
    if (map && maps) {
      const { latitude, longitude } = driverCoords;
      map.panTo(new google.maps.LatLng(latitude, longitude));
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: new google.maps.LatLng(latitude, longitude) },
        (results, status) => {
          if (status === 'OK') setDriverAddress(results[0]);
        },
      );
    }
  }, [driverCoords, map, maps]);
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: '50vh' }}>
        <GoogleMapReact
          defaultZoom={16}
          defaultCenter={{ lat: 59.95, lng: 30.33 }}
          bootstrapURLKeys={{ key: 'AIzaSyD1g4nCyvttbA1GKCwFymDBgpV_usg89T8' }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onGoogleApiLoaded}
          draggable={true}>
          {/* <Driver
            latitude={driverCoords.latitude}
            longitude={driverCoords.longitude}
          /> */}
        </GoogleMapReact>
      </div>
      <div>현재위치: {driverAddress?.formatted_address}</div>
      <div className=" max-w-screen-sm mx-auto bg-white relative -top-10 shadow-lg py-8 px-5">
        {cookedOrdersData?.cookedOrder.restaurant ? (
          <>
            <h1 className="text-center  text-3xl font-medium">
              New Coocked Order
            </h1>
            <h1 className="text-center my-3 text-2xl font-medium">
              Pick it up soon @ {cookedOrdersData?.cookedOrder.restaurant?.name}
            </h1>
            <button
              onClick={() =>
                triggerTakeOrderMutation(cookedOrdersData?.cookedOrder.id)
              }
              className="btn w-full  block  text-center mt-5">
              Accept Challenge &rarr;
            </button>
          </>
        ) : (
          <h1 className="text-center  text-3xl font-medium">
            No orders yet...
          </h1>
        )}
      </div>
    </div>
  );
}

export default DashBoardPage;
