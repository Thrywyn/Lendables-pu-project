'use client';
import {
  Avatar,
  Badge,
  Card,
  Text,
  Grid,
  Spacer,
  Pagination,
  useTheme,
} from '@nextui-org/react';
import { useState, useEffect } from 'react';
import pb from '@/app/(lib)/pocketbase';
import Map from '@/app/(components)/Map';
import { Location } from 'react-iconly';
import { BookingCalendar } from './BookingCalendar';
import getAvgUserRating from '@/app/(lib)/getAvgUserRating';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const PostImage = ({ post }) => {
  const { theme } = useTheme();
  const picturesList = post.pictures;
  const [imageIndex, setImageIndex] = useState(0);
  const [roundedAvgUserRating, setRoundedAvgUserRating] = useState(0);
  const router = useRouter();

  useEffect(() => {
    getAvgUserRating(post.expand.seller.id).then((data) => {
      // console.log('avg rating: ', data, ' for user: ', post.expand.seller.id);
      setRoundedAvgUserRating(data);
    });
  }, []);

  return (
    <>
      <Grid.Container gap={5}>
        <Grid
          sm={70}
          style={{
            width: '100%',
            maxWidth: '65%',
            height: '500px',
          }}
        >
          <Card css={{ w: '100%', h: '1500px' }}>
            <Card.Body css={{ p: 0, maxW: '100%' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '500px',
                }}
              >
                <Card.Image
                  src={
                    post.pictures.length != 0
                      ? `http://127.0.0.1:8090/api/files/${post.collectionName}/${post.id}/${post.pictures[imageIndex]}`
                      : '/tool.jpeg'
                  }
                  objectFit="cover"
                  width="100%"
                  height="100%"
                />
                {post.pictures.length && post.pictures.length > 1 && (
                  <Pagination
                    loop
                    onlyDots
                    color="success"
                    total={post.pictures.length}
                    initialPage={6}
                    onChange={(page) => {
                      setImageIndex(page - 1);
                    }}
                    size="xl"
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      left: '40%',
                    }}
                  />
                )}
              </div>
              <div style={{ padding: '20px' }}>
                <Badge>{post.category}</Badge>
                <Spacer y={0.5} />
                <Text h2 css={{ m: 0 }}>
                  {post.title}
                </Text>
                <Text weight="semibold" size="$sm" css={{ color: '$accents7' }}>
                  {post.price} kr per day + 100 kr base price · available today
                </Text>
                <Card.Divider />
                <Text weight="semibold">Description</Text>
                <Text weight="light" style={{ wordWrap: 'break-word' }}>
                  {post.description || 'No descrtiption'}
                </Text>
                <Spacer y={0.5} />
                <Text weight="semibold">Additional info</Text>
                <div style={{ display: 'flex', gap: '25px' }}>
                  <Card
                    isPressable
                    variant="bordered"
                    style={{ width: '100%' }}
                    onPress={() => {
                      router.push('/users/' + post.expand.seller.id);
                    }}
                  >
                    <Card.Body css={{ p: 20 }}>
                      <Avatar
                        src={
                          post.expand.seller.avatar &&
                          pb.getFileUrl(
                            post.expand.seller,
                            post.expand.seller.avatar
                          )
                        }
                        onClick={() => console.log(post.pictures)}
                        text={
                          post.expand.seller.name &&
                          post.expand.seller.name.match(/\b\w/g).join('')
                        }
                      />
                      <Text h4 style={{ margin: '15px 0px 6px 0px' }}>
                        {post.expand.seller.name}
                      </Text>
                      <Text weight="light" style={{ margin: '6px 0px' }}>
                        +47 {post.phone || post.expand.seller.telephone_number}
                      </Text>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <Text weight="light" style={{ margin: '6px 0px' }}>
                          Average rating:
                        </Text>
                        <Badge
                          isSquared
                          color="success"
                          variant="flat"
                          css={{
                            borderColor: 'transparent',
                          }}
                        >
                          {roundedAvgUserRating != 0
                            ? roundedAvgUserRating + '/5'
                            : 'No ratings'}
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>

                  <Card variant="bordered" style={{ width: '100%' }}>
                    <Card.Body css={{ p: 20 }}>
                      <Location
                        set="curved"
                        primaryColor={theme.colors.green600.value}
                        size="large"
                        style={{ margin: '4px' }}
                      />
                      <Text h4 style={{ margin: '15px 0px 6px 0px' }}>
                        Address
                      </Text>
                      <Text weight="light" style={{ margin: '6px 0px' }}>
                        {post.streetAddress}
                      </Text>
                      <Text weight="light" style={{ margin: '6px 0px' }}>
                        {post.zipcode} {post.city}
                      </Text>
                    </Card.Body>
                  </Card>
                </div>
                <Spacer y={1.5} />
                <div
                  className="mapContainer"
                  style={{ backgroundColor: theme.colors.accents3.value }}
                >
                  <Map
                    address={`${post.streetAddress} ${post.zipcode} ${post.city}`}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Grid>
        <Grid
          sm={7}
          style={{
            maxWidth: '35%',
          }}
        >
          <BookingCalendar post={post} />
        </Grid>
      </Grid.Container>
      <Spacer y={0.4} />
    </>
  );
};
