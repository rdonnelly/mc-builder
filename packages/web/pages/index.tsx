import Head from 'next/head';
import Link from 'next/link';
import { useWindowDimensions } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

import Header from '@components/Header';
import getAbsoluteUrl from '@utils/getAbsoluteUrl';

import base from '@mc-builder/shared/src/components/base';

const IndexPage = () => {
  // TODO fix window width
  const { width } = useWindowDimensions();

  const theme = useTheme();

  return (
    <>
      <Head>
        <title>MC Builder</title>
        <meta name="apple-itunes-app" content="app-id=1516561943" />
        <meta property="og:url" content={getAbsoluteUrl()} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="MC Builder" />
        <meta
          property="og:description"
          content="MC Builder: the premier mobile deck builder and card browser for one of our favorite games"
        />
        <meta
          property="og:image"
          content={getAbsoluteUrl('/images/mc-icon-1024.png')}
        />
        <meta
          property="og:image:secure_url"
          content={getAbsoluteUrl('/images/mc-icon-1024.png')}
        />
      </Head>
      <Header color={theme.color.app.brand.settings}>MC Builder</Header>
      <ScrollView>
        <Container>
          <Logo
            resizeMode="contain"
            source={{ uri: '/images/mc-icon-1024.png' }}
            defaultSource={{ uri: '/images/mc-icon-1024.png' }}
          />

          <List>
            <ListItem>
              <ListItemText>Browse available cards and releases</ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Assemble a deck; choose your hero and aspect to start
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>Share and view decks from friends</ListItemText>
            </ListItem>
            <ListItem last={true}>
              <ListItemText>
                Import decks from{' '}
                <Link href="https://marvelcdb.com" target="_blank">
                  MarvelCDB
                </Link>
              </ListItemText>
            </ListItem>
          </List>

          <StoreLinkContainer width={width}>
            <Link
              href="https://apps.apple.com/us/app/mc-builder/id1516561943"
              target="_blank"
            >
              <StoreImage
                resizeMode="contain"
                source={{ uri: '/images/apple-app-store.png' }}
                defaultSource={{ uri: '/images/apple-app-store.png' }}
              />
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=com.rdonnelly.mcbuilder"
              target="_blank"
            >
              <StoreImage
                resizeMode="contain"
                source={{ uri: '/images/google-play-store.png' }}
                defaultSource={{ uri: '/images/google-play-store.png' }}
              />
            </Link>
          </StoreLinkContainer>

          <Paragraph>
            <ParagraphText center={true}>
              If you would like to stay on the cutting edge and help test the
              app, please{' '}
              <Link href="https://forms.gle/yqpHm3V9t8AKr7v46" target="_blank">
                fill out this form to join the beta!
              </Link>
            </ParagraphText>
          </Paragraph>

          <Heading>
            <HeadingText>Support the App</HeadingText>
          </Heading>

          <Paragraph>
            <ParagraphText>
              Enjoying the app? Consider becoming a Patron! With your support, I
              will be able to continue further development.
            </ParagraphText>
          </Paragraph>

          <Paragraph>
            <ParagraphText>
              <Link
                href="https://www.patreon.com/bePatron?u=4950805"
                target="_blank"
              >
                Become a Patron!
              </Link>
            </ParagraphText>
          </Paragraph>

          <Heading>
            <HeadingText>Have feedback?</HeadingText>
          </Heading>

          <Paragraph>
            <ParagraphText>
              I'm interested in any comments, questions, or suggestions you
              have.{' '}
              <Link
                href="mailto:ryanjdonnelly+mcbuilder@gmail.com"
                target="_blank"
              >
                Send me a message!
              </Link>
            </ParagraphText>
          </Paragraph>
        </Container>
      </ScrollView>
    </>
  );
};

const ScrollView = styled.ScrollView`
  flex: 1;
  width: 100%;
`;

const Container = styled(base.Container)`
  align-items: center;
  padding: 16px;
  width: 100%;
`;

const Logo = styled.Image`
  height: 200px;
  margin-bottom: 24px;
  width: 200px;
`;

const Heading = styled.View`
  margin-bottom: 24px;
  max-width: 584px;
  width: 100%;
`;

const HeadingText = styled.Text`
  font-size: 24px;
  font-weight: 800;
`;

const Paragraph = styled.View`
  margin-bottom: 24px;
  max-width: 584px;
  width: 100%;
`;

const ParagraphText = styled.Text<{ center?: boolean }>`
  font-size: 18px;
  text-align: ${({ center }) => (center ? 'center' : 'left')};
`;

const List = styled.View`
  background: ${({ theme }) => theme.color.list.background};
  border-radius: 6px;
  margin-bottom: 24px;
  max-width: 584px;
  padding-horizontal: 16px;
  width: 100%;
`;

const ListItem = styled.View<{ last?: boolean }>`
  border-bottom-width: ${({ last }) => (last ? 0 : '1px')};
  border-bottom-color: ${({ theme }) => theme.color.list.border};
  padding-vertical: 16px;
`;

const ListItemText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  text-align: center;
`;

const StoreLinkContainer = styled.View<{ width: number }>`
  display: flex;
  flex-direction: ${({ width }) => (width >= 786 ? 'row' : 'column')};
  margin-bottom: 24px;
`;

const StoreImage = styled.Image`
  height: 72px;
  width: 235px;
`;

export default IndexPage;
