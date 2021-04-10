import React from 'react';
import styled from 'styled-components/native';

import Icon, { IconCode } from '../../components/Icon';
import { CardModel } from '../../data';
import { colors } from '../../styles';

const CardDetailStats = ({ card }: { card: CardModel }) => {
  const stats = [];
  // https://github.com/zzorba/marvelsdb/blob/89a8b0aacdb00a561e1c3b237c67654254a1cad8/src/AppBundle/Resources/public/js/app.format.js
  switch (card.typeCode) {
    case 'hero': {
      stats.push(
        <Stat key={'thwart'}>
          <StatData>
            <StatDataText>
              {card.raw.thwart}
              {card.raw.scheme_text ? (
                <Icon
                  code={IconCode.special}
                  color={colors.grayDark}
                  size={16}
                />
              ) : null}
            </StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>THW</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'attack-spacer'} />,
        <Stat key={'attack'}>
          <StatData>
            <StatDataText>
              {card.raw.attack}
              {card.raw.attack_text ? (
                <Icon
                  code={IconCode.special}
                  color={colors.grayDark}
                  size={16}
                />
              ) : null}
            </StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>ATK</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'defense-spacer'} />,
        <Stat key={'defense'}>
          <StatData>
            <StatDataText>{card.raw.defense}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>DEF</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'hand-spacer'} />,
        <Stat key={'hand-size'}>
          <StatData>
            <StatDataText>{card.raw.hand_size}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>HAND</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'health-spacer'} />,
        <Stat key={'health'}>
          <StatData>
            <StatDataText>{card.raw.health}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>HP</StatHeaderText>
          </StatHeader>
        </Stat>,
      );
      break;
    }
    case 'alter_ego': {
      stats.push(
        <Stat key={'recover'}>
          <StatData>
            <StatDataText>{card.raw.recover}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>REC</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'hand-spacer'} />,
        <Stat key={'hand-size'}>
          <StatData>
            <StatDataText>{card.raw.hand_size}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>HAND</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'health-spacer'} />,
        <Stat key={'health'}>
          <StatData>
            <StatDataText>{card.raw.health}</StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>HP</StatHeaderText>
          </StatHeader>
        </Stat>,
      );
      break;
    }
    case 'side_scheme':
    case 'main_scheme': {
      stats.push(
        card.raw.threat == null ? null : (
          <Stat key={'threat-threat'}>
            <StatData>
              <StatDataText>
                {card.raw.threat}
                <Icon
                  code={IconCode.perHero}
                  color={colors.grayDark}
                  size={16}
                />
              </StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>TARGET THREAT</StatHeaderText>
            </StatHeader>
          </Stat>
        ),
        card.raw.threat == null ? null : <StatSpacer key={'threat-spacer'} />,
        <Stat key={'base-threat'}>
          <StatData>
            <StatDataText>
              {card.raw.base_threat}
              {!card.raw.base_threat || card.raw.base_threat_fixed ? null : (
                <Icon
                  code={IconCode.perHero}
                  color={colors.grayDark}
                  size={16}
                />
              )}
            </StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>BASE THREAT</StatHeaderText>
          </StatHeader>
        </Stat>,
        card.raw.escalation_threat == null ? null : (
          <StatSpacer key={'escalation-spacer'} />
        ),
        card.raw.escalation_threat == null ? null : (
          <Stat key={'escalation-threat'}>
            <StatData>
              <StatDataText>
                +{card.raw.escalation_threat}
                {!card.raw.escalation_threat ||
                card.raw.escalation_threat_fixed ? null : (
                  <Icon
                    code={IconCode.perHero}
                    color={colors.grayDark}
                    size={16}
                  />
                )}
                {card.raw.escalation_threat_fixed ? null : (
                  <Icon
                    code={IconCode.special}
                    color={colors.grayDark}
                    size={16}
                  />
                )}
              </StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>ESC THREAT</StatHeaderText>
            </StatHeader>
          </Stat>
        ),
      );

      break;
    }
    case 'attachment': {
      stats.push(
        card.raw.attack == null ? null : (
          <Stat key={'attack'}>
            <StatData>
              <StatDataText>
                +{card.raw.attack}
                {card.raw.attack_text ? (
                  <Icon
                    code={IconCode.special}
                    color={colors.grayDark}
                    size={16}
                  />
                ) : null}
              </StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>ATK</StatHeaderText>
            </StatHeader>
          </Stat>
        ),
        card.raw.attack == null || card.raw.scheme == null ? null : (
          <StatSpacer key={'scheme-spacer'} />
        ),
        card.raw.scheme == null ? null : (
          <Stat key={'scheme'}>
            <StatData>
              <StatDataText>
                +{card.raw.scheme}
                {card.raw.scheme_text ? (
                  <Icon
                    code={IconCode.special}
                    color={colors.grayDark}
                    size={16}
                  />
                ) : null}
              </StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>SCH</StatHeaderText>
            </StatHeader>
          </Stat>
        ),
      );
      break;
    }

    case 'support':
    case 'ally':
    case 'upgrade':
    case 'resource':
    case 'event': {
      if (card.typeCode !== 'resource') {
        stats.push(
          <Stat key={'cost'}>
            <StatData>
              <StatDataText>{card.raw.cost}</StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>COST</StatHeaderText>
            </StatHeader>
          </Stat>,
        );
      }

      if (card.typeCode === 'ally') {
        stats.push(
          <StatSpacer key={'thwart-spacer'} />,
          <Stat key={'thwart'}>
            <StatData>
              <StatDataText>
                {card.raw.thwart != null ? card.raw.thwart : '–'}
                {card.raw.scheme_text ? (
                  <Icon
                    code={IconCode.special}
                    color={colors.grayDark}
                    size={16}
                  />
                ) : null}
                {[...Array(card.raw.thwart_cost || 0).keys()].map((i) => (
                  <Icon
                    code={IconCode.cost}
                    color={colors.grayDark}
                    size={16}
                    key={`icon-${i}`}
                  />
                ))}
              </StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>THW</StatHeaderText>
            </StatHeader>
          </Stat>,
          <StatSpacer key={'attack-spacer'} />,
          <Stat key={'attack'}>
            <StatData>
              <StatDataText>
                {card.raw.attack}
                {card.raw.attack_text ? (
                  <Icon
                    code={IconCode.special}
                    color={colors.grayDark}
                    size={16}
                  />
                ) : null}
                {[...Array(card.raw.attack_cost || 0).keys()].map((i) => (
                  <Icon
                    code={IconCode.cost}
                    color={colors.grayDark}
                    size={16}
                    key={`icon-${i}`}
                  />
                ))}
              </StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>ATK</StatHeaderText>
            </StatHeader>
          </Stat>,
        );
      }

      if (card.raw.health) {
        stats.push(
          <StatSpacer key={'health-spacer'} />,
          <Stat key={'health'}>
            <StatData>
              <StatDataText>{card.raw.health}</StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>HP</StatHeaderText>
            </StatHeader>
          </Stat>,
        );
      }

      break;
    }
    case 'villain':
    case 'minion':
      stats.push(
        <Stat key={'scheme'}>
          <StatData>
            <StatDataText>
              {card.raw.scheme}
              {card.raw.scheme_text ? (
                <Icon
                  code={IconCode.special}
                  color={colors.grayDark}
                  size={16}
                />
              ) : null}
            </StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>SCH</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'attack-spacer'} />,
        <Stat key={'attack'}>
          <StatData>
            <StatDataText>
              {card.raw.attack}
              {card.raw.attack_text ? (
                <Icon
                  code={IconCode.special}
                  color={colors.grayDark}
                  size={16}
                />
              ) : null}
            </StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>ATK</StatHeaderText>
          </StatHeader>
        </Stat>,
        <StatSpacer key={'health-spacer'} />,
        <Stat key={'health'}>
          <StatData>
            <StatDataText>
              {card.raw.health}
              {card.isHealthPerHero ? (
                <Icon
                  code={IconCode.perHero}
                  color={colors.grayDark}
                  size={16}
                />
              ) : null}
            </StatDataText>
          </StatData>
          <StatHeader>
            <StatHeaderText>HP</StatHeaderText>
          </StatHeader>
        </Stat>,
        card.typeCode !== 'villain' ? null : (
          <StatSpacer key={'stage-spacer'} />
        ),
        card.typeCode !== 'villain' ? null : (
          <Stat key={'stage'}>
            <StatData>
              <StatDataText>{card.raw.stage}</StatDataText>
            </StatData>
            <StatHeader>
              <StatHeaderText>STAGE</StatHeaderText>
            </StatHeader>
          </Stat>
        ),
      );
      break;
  }
  return <CardDetailStatsContainer>{stats}</CardDetailStatsContainer>;
};

const CardDetailStatsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-horizontal: -8px;
`;

const Stat = styled.View`
  background-color: ${colors.lightGray};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  flex: 1 1 80px;
  justify-content: flex-end;
  margin-bottom: 16px;
  margin-horizontal: 8px;
  padding: 16px;
`;

const StatData = styled.View``;

const StatDataText = styled.Text`
  color: ${colors.darkGray};
  font-size: ${({ theme }) => theme.fontSize.heading};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const StatHeader = styled.View``;

const StatHeaderText = styled.Text`
  color: ${colors.grayDark};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const StatSpacer = styled.View``;

export default CardDetailStats;
