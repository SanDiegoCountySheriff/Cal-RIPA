<template>
  <v-expansion-panels>
    <v-expansion-panel
      class="stopAccordionWrapper"
      v-for="(item, i) in items"
      :key="i"
    >
      <v-expansion-panel-header>
        <v-row>
          <v-col cols="12">
            <h3>Stop #{{ item.id }}</h3>
            <span class="stopAccordionWrapper--dateTime text--secondary">
              {{ formatStopDate(item.stopDateTime) }}
            </span>
          </v-col>
        </v-row>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div class="tw-text-xs tw-break-words">{{ item.jsonStop }}</div>
        <div class="stopAccordionWrapper--detailSection">
          <v-row align="center">
            <v-col cols="3">DETAILS </v-col>
            <v-col cols="5">
              <v-btn color="secondary"> Edit </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3"> Date </v-col>
            <v-col cols="3">
              {{ formatStopDate(item.stopDateTime) }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3"> Time </v-col>
            <v-col cols="3">
              {{ item.time }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3"> Duration </v-col>
            <v-col cols="3">
              {{ item.stopDuration }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3"> Block </v-col>
            <v-col cols="3">
              {{ item.location.blockNumber }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3"> Street </v-col>
            <v-col cols="3">
              {{ item.location.streetName }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3"> City </v-col>
            <v-col cols="3">
              {{ item.location.streetname }}
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3"> Beat </v-col>
            <v-col cols="3">
              {{ item.location.streetname }}
            </v-col>
          </v-row>
        </div>
        <div
          v-if="item.listPersonStopped.length > 0"
          class="stopAccordionWrapper--detailSection"
        >
          <div
            v-for="(person, i) in item.listPersonStopped"
            :key="i"
            :class="[
              i !== item.listPersonStopped.length - 1 ? 'lastPerson' : '',
              'stopAccordionWrapper--personWrapper',
            ]"
            class=""
          >
            <v-row align="center">
              <v-col cols="3"> PERSON {{ i + 1 }} </v-col>
              <v-col cols="3">
                <v-btn color="secondary"> Edit</v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">Perceived Race</v-col>
              <v-col cols="3">
                <span
                  class="listItems"
                  v-for="(raceObj, i) in person.listPerceivedRace"
                  :key="i"
                  >{{ raceObj.race }}</span
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">Perceived Age</v-col>
              <v-col cols="3">
                {{ person.perceivedAge }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">Perceived Gender</v-col>
              <v-col cols="3">
                {{ person.perceivedGender }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">Gender Nonconforming</v-col>
              <v-col cols="3">
                {{ person.genderNonconforming ? 'Yes' : 'No' }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">Perceived LGBT</v-col>
              <v-col cols="3">
                {{ person.perceivedLgbt ? 'Yes' : 'No' }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">Perceived Disability</v-col>
              <v-col cols="3">
                <span
                  class="listItems"
                  v-for="(
                    disabilityObj, j
                  ) in person.listPerceivedOrKnownDisability"
                  :key="j"
                  >{{ disabilityObj.disability }}</span
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">Reason for Stop</v-col>
              <v-col cols="3">
                <span
                  class="listItems"
                  v-for="(stopDetailObj, k) in person.reasonForStop.listDetail"
                  :key="k"
                  >{{ stopDetailObj.reason }}</span
                >
                <span
                  class="listItems"
                  v-for="(stopCodeObj, l) in person.reasonForStop.listCodes"
                  :key="l"
                  >{{ stopCodeObj.text }}</span
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">Comments on Stop</v-col>
              <v-col cols="3">
                {{ person.reasonForStopExplanation }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">Actions Taken</v-col>
              <v-col cols="3">
                <span
                  class="listItems"
                  v-for="(
                    actionsTakenObj, m
                  ) in person.listActionTakenDuringStop"
                  :key="m"
                  >{{ actionsTakenObj.action }}</span
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">Contraband Discovered</v-col>
              <v-col cols="3">
                <span
                  class="listItems"
                  v-for="(
                    contraBandObj, n
                  ) in person.listContrabandOrEvidenceDiscovered"
                  :key="n"
                  >{{ contraBandObj.contraband }}</span
                >
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">Result of Stop</v-col>
              <v-col cols="3">
                <span
                  class="listItems"
                  v-for="(resultObj, o) in person.listResultOfStop"
                  :key="o"
                  >{{ resultObj.result }}</span
                >
              </v-col>
            </v-row>
          </div>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { format } from 'date-fns'

export default {
  name: 'ripa-accordion',

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    formatStopDate(date) {
      return format(new Date(date), 'MM-dd-yyyy')
    },
  },
}
</script>

<style lang="scss">
.stopAccordionWrapper {
  margin: 10px 0;

  h3 {
    font-size: 18px;
  }

  .stopAccordionWrapper--dateTime {
    display: block;
    margin-top: 10px;
  }

  .stopAccordionWrapper--detailSection {
    margin: 0px 0;
    padding: 20px 0 20px 10px;
    border-bottom: 1px solid #cccccc;

    .col {
      padding-left: 0px;
    }

    .listItems {
      display: block;
    }
  }

  .stopAccordionWrapper--personWrapper {
    &.lastPerson {
      border-bottom: none;
    }
  }
}
</style>
