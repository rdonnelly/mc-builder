import React, { memo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import CardDetailFooter from '@components/CardDetail/CardDetailFooter';
import CardDetailHeader from '@components/CardDetail/CardDetailHeader';
import CardDetailImages from '@components/CardDetail/CardDetailImages';
import CardDetailPack from '@components/CardDetail/CardDetailPack';
import CardDetailStats from '@components/CardDetail/CardDetailStats';
import CardDetailText from '@components/CardDetail/CardDetailText';
import { CardModel } from '@data';
import { base, colors } from '@styles';

// TODO add card title to top of page (optional?)
// TODO make width optional, default flex: 1
// TODO make haptics and share optional
// TODO device info? do we really need to do this?

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 72,
  },
});

const CardDetail = ({ card, width }: { card: CardModel; width: number }) => {
  return (
    <CardDetailContainer width={width}>
      <ContainerScrollView
        contentContainerStyle={styles.scrollViewContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <CardDetailHeader card={card} />
        <CardDetailStats card={card} />
        <CardDetailText card={card} />
        <CardDetailFooter card={card} />
        <CardDetailImages card={card} maxWidth={width} />
        <CardDetailPack card={card} />
      </ContainerScrollView>
    </CardDetailContainer>
  );
};

const CardDetailContainer = styled(base.Container)<{ width: number }>`
  background-color: ${colors.white};
  width: ${(props) => props.width}px;
`;

const ContainerScrollView = styled(ScrollView)`
  flex: 1 1 auto;
  width: 100%;
`;

export default memo(CardDetail);
