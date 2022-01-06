import Head from 'next/head';
import { Text } from 'react-native-web';
import styled from 'styled-components/native';

import { base, colors } from '@mc-builder/shared/src/styles';

import Header from '../components/Header';
import getAbsoluteUrl from '../utils/getAbsoluteUrl';

const IndexPage = () => {
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
      <Header color={colors.blue}>MC Builder</Header>
      <ScrollView>
        <Container>
          <Image
            resizeMode="contain"
            source={{ uri: '/images/mc-icon-1024.png' }}
          />
          <Paragraph>
            <ParagraphText>
              Having trouble remembering what comes in a card pack? Looking for
              a reference to check card text? Need help building a deck and
              seeing available cards? Let the MC Deck Builder app help!
            </ParagraphText>
          </Paragraph>

          <List>
            <ListItem>
              <ListItemText>
                Browse available cards and pack (through most recent official US
                release)
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Assemble a deck; just choose your hero, aspect, and get going
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Share your deck view others to view and import
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                Import decks from{' '}
                <LinkText
                  href="https://marvelcdb.com"
                  hrefAttrs={{ target: '_blank' }}
                >
                  MarvelCDB
                </LinkText>
              </ListItemText>
            </ListItem>
          </List>

          <Paragraph>
            <ParagraphText>
              The app is coming soon.{' '}
              <LinkText
                href="https://forms.gle/yqpHm3V9t8AKr7v46"
                hrefAttrs={{ target: '_blank' }}
              >
                Fill out this form to join the beta!
              </LinkText>
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
              <LinkText
                href="https://www.patreon.com/bePatron?u=4950805"
                hrefAttrs={{ target: '_blank' }}
              >
                Become a Patron!
              </LinkText>
            </ParagraphText>
          </Paragraph>

          <Heading>
            <HeadingText>Have feedback?</HeadingText>
          </Heading>

          <Paragraph>
            <ParagraphText>
              I'm interested in any comments, questions, or suggestions you
              have.{' '}
              <LinkText
                href="mailto:ryanjdonnelly+mcbuilder@gmail.com"
                hrefAttrs={{ target: '_blank' }}
              >
                Send me a message!
              </LinkText>
            </ParagraphText>
          </Paragraph>
        </Container>
      </ScrollView>
    </>
  );
};

const ScrollView = styled.ScrollView`
  width: 100%;
`;

const Container = styled(base.Container)`
  align-items: center;
  padding: 16px;
  width: 100%;
`;

const Image = styled.Image`
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
  font-size: 20px;
  font-weight: 800;
`;

const Paragraph = styled.View`
  margin-bottom: 24px;
  max-width: 584px;
  width: 100%;
`;

const ParagraphText = styled.Text`
  font-size: 18px;
`;

const LinkText = styled(Text)`
  color: ${colors.blue};
  text-decoration: underline ${colors.blue};
`;

const List = styled.View`
  margin-bottom: 24px;
  max-width: 584px;
  padding: 0 16px;
  width: 100%;
`;

const ListItem = styled.View`
  border-left-color: ${colors.orange};
  border-left-width: 4px;
  padding-left: 8px;
  margin-bottom: 16px;
`;

const ListItemText = styled.Text`
  font-size: 16px;
`;

export default IndexPage;
