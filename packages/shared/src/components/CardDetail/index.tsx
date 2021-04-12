import { memo } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

import CardDetailFooter from '../../components/CardDetail/CardDetailFooter';
import CardDetailHeader from '../../components/CardDetail/CardDetailHeader';
import CardDetailImages from '../../components/CardDetail/CardDetailImages';
import CardDetailPack from '../../components/CardDetail/CardDetailPack';
import CardDetailStats from '../../components/CardDetail/CardDetailStats';
import CardDetailText from '../../components/CardDetail/CardDetailText';
import { CardModel } from '../../data';
import { base, colors } from '../../styles';

const styles = StyleSheet.create({
  scrollViewContentContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 72,
  },
});

const CardDetail = ({
  card,
  hideTitle,
  width,
  shareCardImage,
}: {
  card: CardModel;
  width: number;
  hideTitle?: boolean;
  shareCardImage?: (uri: string) => void;
}) => {
  return (
    <CardDetailContainer width={width}>
      <ContainerScrollView
        contentContainerStyle={styles.scrollViewContentContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <CardDetailHeader card={card} hideTitle={hideTitle} />
        <CardDetailStats card={card} />
        <CardDetailText card={card} />
        <CardDetailFooter card={card} />
        <CardDetailImages
          card={card}
          maxWidth={width}
          shareCardImage={shareCardImage}
        />
        <CardDetailPack card={card} />
      </ContainerScrollView>
    </CardDetailContainer>
  );
};

const CardDetailContainer = styled(base.Container)<{ width: number }>`
  background-color: ${colors.white};
  margin: 0 auto;
  width: ${({ width }) => `${width}px`};
`;

const ContainerScrollView = styled(ScrollView)`
  flex: 1 1 auto;
  width: 100%;
`;

export default memo(CardDetail);
