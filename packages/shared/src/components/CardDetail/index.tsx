import { memo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import CardDetailFooter from '../../components/CardDetail/CardDetailFooter';
import CardDetailHeader from '../../components/CardDetail/CardDetailHeader';
import CardDetailImages from '../../components/CardDetail/CardDetailImages';
import CardDetailPack from '../../components/CardDetail/CardDetailPack';
import CardDetailStats from '../../components/CardDetail/CardDetailStats';
import CardDetailText from '../../components/CardDetail/CardDetailText';
import { Card as CardModel } from '../../data/models/Card';
import base from '../base';

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    alignItems: 'stretch',
    paddingTop: 16,
    paddingBottom: 72,
  },
});

type CardDetailProps = {
  card: CardModel;
  hideTitle?: boolean;
  shareCardImage?: (uri: string) => void;
};

const CardDetail = ({ card, hideTitle, shareCardImage }: CardDetailProps) => {
  return (
    <CardDetailContainer>
      <ContainerScrollView
        contentContainerStyle={styles.scrollViewContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <CardDetailHeader card={card} hideTitle={hideTitle} />
        <CardDetailStats card={card} />
        <CardDetailText card={card} />
        <CardDetailFooter card={card} />
        <CardDetailImages card={card} shareCardImage={shareCardImage} />
        <CardDetailPack card={card} />
      </ContainerScrollView>
    </CardDetailContainer>
  );
};

const CardDetailContainer = styled(base.Container)`
  background-color: ${({ theme }) => theme.color.app.background};
`;

const ContainerScrollView = styled(ScrollView)`
  width: 100%;
`;

export default memo<CardDetailProps>(CardDetail);
