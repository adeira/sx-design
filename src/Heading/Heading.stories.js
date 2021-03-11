/**
 * https://storybook.js.org/docs/react/writing-stories/introduction
 * @flow
 */

import React from 'react';
import sx from '@adeira/sx';

import Heading from './Heading';
import Section from '../Section/Section';

// 👇 This default export determines where your story goes in the story list
export default {
  title: 'Example/Heading',
  component: Heading,
  argTypes: {
    // hide children property from the Storybook
    children: {
      table: {
        disable: true,
      },
    },
  },
};

// 👇 We create a "template" of how args map to rendering
const Template = (args) => (
  <>
    <Heading {...args}>Top level heading (h1)</Heading>
    <Section>
      <Heading {...args}>
        Heading inside <code>{'<Section />'}</code> component (h2)
      </Heading>
      <Section>
        <Heading {...args}>
          Heading inside another <code>{'<Section />'}</code> component (h3)
        </Heading>
        <Section>
          <Heading {...args}>
            Heading inside another <code>{'<Section />'}</code> component (h4)
          </Heading>
          <Section>
            <Heading {...args}>
              Heading inside another <code>{'<Section />'}</code> component (h5)
            </Heading>
            <Section>
              <Heading {...args}>
                Heading inside another <code>{'<Section />'}</code> component (h6)
              </Heading>
              <Section>
                <Heading {...args}>
                  Heading inside another <code>{'<Section />'}</code> component (still h6)
                </Heading>
              </Section>
            </Section>
          </Section>
        </Section>
      </Section>
    </Section>
  </>
);

/* eslint-disable sx/no-unused-stylesheet */
const styles = sx.create({
  default: {
    color: 'darkred',
  },
});
/* eslint-enable sx/no-unused-stylesheet */

// 👇 Each story then reuses that template
export const BasicHeading: $FlowFixMe = Template.bind({});
BasicHeading.storyName = 'Basic';
BasicHeading.args = {
  xstyle: styles.default,
};