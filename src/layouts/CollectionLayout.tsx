import { ReactElement, ReactNode } from 'react';
import Head from 'next/head';
import { Collection } from '../graphql.types';
import { useTranslation } from 'next-i18next';
import { Overview } from './../components/Overview';
import { CollectionQueryClient } from './../queries/collection.graphql';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import Icon from '../components/Icon';
import Img from '../components/Image';
import { Chart } from '../components/Chart';
import { useQuery } from '@apollo/client';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';
import Link from 'next/link';
interface CollectionLayoutProps {
  children: ReactElement;
  collection: Collection;
}

function CollectionFigure({
  label,
  children,
  loading = false,
}: {
  label: string;
  children: ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="text-center">
      <div className="truncate text-sm text-gray-300">{label}</div>
      {loading ? (
        <div className="h-6 w-full animate-pulse rounded-md bg-gray-700 transition" />
      ) : (
        <div className="flex items-center justify-center gap-1 font-semibold">{children}</div>
      )}
    </div>
  );
}

interface CollectionData {
  collection: Collection;
}

interface CollectionVariables {
  id: string;
  startTime: string;
  endTime: string;
}

enum CollectionPath {
  Nfts = '/collections/[id]',
  Analytics = '/collections/[id]/analytics',
  Activity = '/collections/[id]/activity',
}

function CollectionLayout({ children, collection }: CollectionLayoutProps): JSX.Element {
  const { t } = useTranslation(['collection', 'common']);
  const router = useRouter();
  const startTime = format(
    startOfDay(subDays(new Date(), 1)),
    "yyyy-MM-dd'T'hh:mm:ssxxx"
  ) as string;
  const endTime = format(endOfDay(new Date()), "yyyy-MM-dd'T'hh:mm:ssxxx") as string;

  const collectionQueryClient = useQuery<CollectionData, CollectionVariables>(
    CollectionQueryClient,
    {
      variables: {
        id: router.query.id as string,
        startTime,
        endTime,
      },
    }
  );

  return (
    <>
      <Head>
        <title>{`${t('metadata.title', { ns: 'collection', name: collection.name })} | ${t('header.title', { ns: 'common' })}`}</title>
        <meta name="description" content={collection.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Overview>
        <div className="mx-4 mb-10 flex flex-col items-center justify-center gap-10 text-white md:mx-10 md:mb-12 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start xl:gap-10">
            <div className="flex flex-shrink-0 rounded-lg border-8 border-gray-800">
              <Img
                fallbackSrc="/images/moon.svg"
                src={collection.image}
                className="inline-block aspect-square h-36 w-36 rounded-md object-cover shadow-xl md:h-36 md:w-36"
                alt="overview avatar"
              />
            </div>
            <div className="space-y-4 md:mt-2">
              <Overview.Title>{collection.name}</Overview.Title>
              {[collection.twitterUrl, collection.websiteUrl, collection.discordUrl].some(
                Boolean
              ) && (
                <div className="flex justify-center gap-4 text-gray-300 md:justify-start">
                  {collection.twitterUrl && (
                    <a
                      target="_blank"
                      rel="nofollow noreferrer"
                      className="hover:text-white"
                      href={collection.twitterUrl}
                    >
                      <Icon.Twitter className="h-5 w-auto" />
                    </a>
                  )}
                  {collection.websiteUrl && (
                    <a
                      target="_blank"
                      rel="nofollow noreferrer"
                      className="hover:text-white"
                      href={collection.websiteUrl}
                    >
                      <Icon.Web className="h-5 w-auto" />
                    </a>
                  )}
                  {collection.discordUrl && (
                    <a
                      target="_blank"
                      rel="nofollow noreferrer"
                      className="hover:text-white"
                      href={collection.discordUrl}
                    >
                      <Icon.Discord className="h-5 w-auto" />
                    </a>
                  )}
                </div>
              )}

              <p
                className={clsx(
                  'max-w-sm text-center text-gray-300 md:text-left',
                  'line-clamp-2 md:line-clamp-4'
                )}
              >
                {collection.description}
              </p>
            </div>
          </div>

          {/* [Charts], Data */}
          <div className="flex w-full flex-col-reverse items-center justify-center gap-4 md:w-min md:flex-row md:items-start md:justify-start">
            <div className="flex w-full gap-4 md:w-min">
              {(collectionQueryClient.loading ||
                collectionQueryClient.data?.collection.timeseries.floorPrice) && (
                <Chart.Preview
                  className="h-40 w-full md:w-36 xl:w-40"
                  title={t('floorPrice', { ns: 'collection' })}
                  dateRange={t('timeInterval.day', { ns: 'collection' })}
                  chart={
                    <Chart.TinyLineChart
                      data={collectionQueryClient.data?.collection.timeseries.floorPrice || []}
                      loading={collectionQueryClient.loading}
                    />
                  }
                />
              )}
              {(collectionQueryClient.loading ||
                collectionQueryClient.data?.collection.timeseries.listedCount) && (
                <Chart.Preview
                  className="h-40 w-full md:w-36 xl:w-40"
                  title={t('listings', { ns: 'collection' })}
                  dateRange={t('timeInterval.day', { ns: 'collection' })}
                  chart={
                    <Chart.TinyLineChart
                      data={collectionQueryClient.data?.collection.timeseries.listedCount || []}
                      loading={collectionQueryClient.loading}
                    />
                  }
                />
              )}
            </div>
            {(collectionQueryClient.loading ||
              [
                collectionQueryClient.data?.collection.trends?.compactFloor1d,
                collectionQueryClient.data?.collection.trends?.compactVolume30d,
                collectionQueryClient.data?.collection.marketCap,
                collectionQueryClient.data?.collection.trends?.compactListed1d,
                collectionQueryClient.data?.collection.holderCount,
                collection?.compactPieces,
              ].every(Boolean)) && (
              <div className="grid h-40 w-full grid-cols-3 grid-rows-2 gap-4 rounded-2xl bg-gray-800 p-6 md:ml-auto md:w-80 xl:w-96">
                <CollectionFigure
                  label={t('floorPrice', { ns: 'collection' })}
                  loading={collectionQueryClient.loading}
                >
                  <Icon.Sol /> {collectionQueryClient.data?.collection.trends?.compactFloor1d}
                </CollectionFigure>
                <CollectionFigure
                  label={t('30dVolume', { ns: 'collection' })}
                  loading={collectionQueryClient.loading}
                >
                  <Icon.Sol /> {collectionQueryClient.data?.collection.trends?.compactVolume30d}
                </CollectionFigure>
                <CollectionFigure
                  label={t('estimatedMarketcap', { ns: 'collection' })}
                  loading={collectionQueryClient.loading}
                >
                  <Icon.Sol /> {collectionQueryClient.data?.collection.marketCap}
                </CollectionFigure>
                <CollectionFigure
                  label={t('listings', { ns: 'collection' })}
                  loading={collectionQueryClient.loading}
                >
                  {collectionQueryClient.data?.collection.trends?.compactListed1d}
                </CollectionFigure>
                <CollectionFigure
                  label={t('holders', { ns: 'collection' })}
                  loading={collectionQueryClient.loading}
                >
                  {collectionQueryClient.data?.collection.holderCount}
                </CollectionFigure>
                <CollectionFigure
                  label={t('supply', { ns: 'collection' })}
                  loading={collectionQueryClient.loading}
                >
                  {collection?.compactPieces}
                </CollectionFigure>
              </div>
            )}
          </div>
        </div>
        <Overview.Tabs>
          <Overview.Tab
            label={t('nfts', { ns: 'collection' })}
            href={`/collections/${collection.id}`}
            active={router.pathname === CollectionPath.Nfts}
          />
          <Overview.Tab
            label={t('activity', { ns: 'collection' })}
            href={`/collections/${collection.id}/activity`}
            active={router.pathname === CollectionPath.Activity}
          />
          <Overview.Tab
            label={t('analytics', { ns: 'collection' })}
            href={`/collections/${collection.id}/analytics`}
            active={router.pathname === CollectionPath.Analytics}
          />
        </Overview.Tabs>
        {children}
      </Overview>
    </>
  );
}

export default CollectionLayout;
