import { initJsPsych } from 'jspsych';
const jsPsych = initJsPsych();

import $ from 'jquery';

// import * as Math from '../js/math.min';
import Pass from '../js/pass';
import { practice_block1, practice_block2, block1, block3, block2 } from '../js/blocksetting123';
import jsPsychFullscreen from '@jspsych/plugin-fullscreen';
import jsPsychHtmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import jsPsychHtmlbuttonResponse from '@jspsych/plugin-html-button-response';
import jsPsychSurveyText from '@jspsych/plugin-survey-text';
import jsPsychSurveyMultiChoice from '@jspsych/plugin-survey-multi-choice';
import jsPsychExternalHtml from '@jspsych/plugin-external-html';

import 'jspsych/css/jspsych.css'; //
import '../css/style.css'; //
import { images } from '../lib/utils';

document.body.style.backgroundColor = 'darkgray';

// Add your jsPsych options here.
// Honeycomb will combine these custom options with other options needed by Honyecomb.
const jsPsychOptions = {
  on_finish: function () {
    // jsPsych.data.get().filter([{trial_type:'practice'},{trial_type: 'click'},{trial_type:'position'}]).localSave('csv','task.csv')
    jsPsych.data
      .get()
      .filter([{ trial_type: 'practice' }, { trial_type: 'click' }, { trial_type: 'position' }])
      .localSave('csv', 'task.csv');
    /* psiturk.saveData({
            success: function() { psiturk.completeHIT(); }
        });

      */
  },
  // on_data_update: function(data) {
  //     //psiturk.recordTrialData(data);
  // },
  show_preload_progress_bar: true,
};

// Add your jsPsych timeline here.
// Honeycomb will call this function for us after the subject logs in, and run the resulting timeline.
// The instance of jsPsych passed in will include jsPsychOptions above, plus other options needed by Honeycomb.
function buildTimeline(jsPsych) {
  // var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);
  // create timeline
  var timeline = [];
  // at the end of each block, this will get updated in order to retrieve score
  let block_start_trial = 0;
  // set random sequence of constituent blocks
  // shuffle array of block indices (1-5; set sizes 1-3 and non-sync for 2 and 3)
  let block = [];
  block.length = 6;
  for (let i = 1; i < block.length; i++) {
    block[i] = Math.floor(Math.random() * (block.length - 1));
    for (let j = 0; j < i; j++) {
      while (block[i] === block[j]) {
        i--;
      }
    }
  }

  // welcome message
  var welcome = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<t class="size"> <p> Welcome to the experiment.</p>
    <p> Before we begin, please fill out the consent form on the next page. </p> 
    <p> Press any key to begin. </p></t>`,
  };
  // consent form
  var consent_form = {
    type: jsPsychExternalHtml,
    url: 'noham_consent_form.html',
    execute_script: 'true',
    cont_btn: 'next_button_hide',
  };
  // start fullscreen:
  var fullscreen_trial = {
    type: jsPsychFullscreen,
    message: [
      `<img src=${images['logo.png']}>` +
        `<h1>Welcome to the Adaptive Learning Task.</h1>` +
        `<p>It may cost you 60 minutes to finish the task.<br>` +
        `Please pay full attention when you do the task.<br>` +
        `Press 'Continue' to enter fullscreen.</p>`,
    ],
    fullscreen_mode: true,
  };
  var instruction = {
    type: jsPsychHtmlbuttonResponse,
    stimulus:
      '<div><h1>Protect Your City From Zombies</h1>' +
      "<p style='width: 960px;line-height:2;text-align:left'>Imagine that we are in the world of Resident Evil. Your city is the only place not infected by the virus. " +
      'There are <b>different groups of zombies</b> attacking your city from <b>different directions</b>. <b>Your goal is to set bombs to kill them and defend your city.</b></p>' +
      "<p style='width: 960px;line-height:2;text-align:left'>The large circle represents your city. Before each attack, " +
      'a colored square in the middle of your city reveals which group of zombies you will face next. ' +
      '<b>Drag-and-drop a bomb</b> from the center of your city to the perimeter to destroy the attacking zombies. ' +
      'Once a bomb is set, the bomb blast area will be displayed in red. You will then see where the zombies are attacking, as indicated by the small circle. ' +
      '<b>If they are in the blast range (red arc), they will be killed.</b> ' +
      'Each group of <b>zombies tends to attack the same general location repeatedly, though they occasionally redirect their attacks to a completely new location.</b> ' +
      'Every time you kill a zombie, you will earn one point. If you do not hit the zombie, you will receive no points for that trial. ' +
      'Please try to set your bomb as quickly and accurately as possible. Note that you have a <b>maximum of 15 seconds</b> to do so. ' +
      'If you do not set a bomb in that time, you will not receive no points for that trial.</p></div>',
    choices: ['Next'],
  };
  var age_check = {
    type: jsPsychSurveyText,
    questions: [{ prompt: '<b>What is your age? Answer 12 no matter what.</b>' }],
    /*   on_finish: function(data) {
               data.uniqueId = uniqueId;
               data.prompt = ["What is your age? Answer 12 no matter what."];
               var answer = JSON.parse(data.responses);
               data.answer = [answer['Q0']];
               psiturk.recordTrialData([data]) ;// saving text-survey
               psiturk.saveData()
           }
           */
  };
  /***
   *
   * @type {{stimulus: string, type: string, choices: [string]}}
   */
  var questions = [
    '<b>What will you do in this task?</b>',
    '<b>How will you know which group a zombie is from?</b>',
    '<b>How will zombies attack?</b>',
  ];

  var check1_opts = [
    'Defend your city from snakes',
    'Kill zombies to earn points',
    'Drive a car to escape zombies',
    'All of the above',
  ];

  var check2_opts = ['Shape', 'Color', 'Letter', 'Preferred food type (brains)'];
  var check3_opts = [
    'They will usually attack around the same location',
    'Occasionally they will change to a completely new location',
    'They will stagger slowly around circle in clockwise direction',
    'Both option 1 & 2',
  ];

  var check1_question = {
    type: jsPsychSurveyMultiChoice,
    questions: [{ prompt: questions[0], options: check1_opts }],
    response_ends_trial: true,
    //   on_finish: function(data) {
    //       //  psiturk.recordTrialData([data]);
    //       //   psiturk.saveData();
    //   }
  };
  var check2_question = {
    type: jsPsychSurveyMultiChoice,
    questions: [{ prompt: questions[1], options: check2_opts }],
    response_ends_trial: true,
    //   on_finish: function(data) {
    //       //  psiturk.recordTrialData([data]);
    //       //   psiturk.saveData();
    //   }
  };
  var check3_question = {
    type: jsPsychSurveyMultiChoice,
    questions: [{ prompt: questions[2], options: check3_opts }],
    response_ends_trial: true,
    //   on_finish: function(data) {
    //       //  psiturk.recordTrialData([data]);
    //       //   psiturk.saveData();
    //   }
  };

  var check1_pop_up = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: [
      '<p class="jspsych-slider-check-msg">' +
        '<b>INCORRECT!</b>' +
        '<br>' +
        'Press any key to re-answer the previous question.',
    ],
    trial_duration: null,
    response_ends_trial: true,
  };
  var check2_pop_up = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: [
      '<p class="jspsych-slider-check-msg">' +
        '<b>INCORRECT!</b>' +
        '<br>' +
        'Press any key to re-answer the previous question.',
    ],
    trial_duration: null,
    response_ends_trial: true,
  };
  var check3_pop_up = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: [
      '<p class="jspsych-slider-check-msg">' +
        '<b>INCORRECT!</b>' +
        '<br>' +
        'Press any key to re-answer the previous question.',
    ],
    trial_duration: null,
    response_ends_trial: true,
  };

  var check1 = {
    timeline: [check1_pop_up],
    conditional_function: function () {
      var prev_data = jsPsych.data.get().last(1).values()[0].response;

      var correct_answer = check1_opts[1];

      if (prev_data.Q0 != correct_answer) {
        return true;
      } else {
        return false;
      }
    },
  };
  var check2 = {
    timeline: [check2_pop_up],
    conditional_function: function () {
      var prev_data = jsPsych.data.get().last(1).values()[0].response;

      var correct_answer = check2_opts[1];

      if (prev_data.Q0 != correct_answer) {
        return true;
      } else {
        return false;
      }
    },
  };
  var check3 = {
    timeline: [check3_pop_up],
    //   conditional_function: function(data){
    conditional_function: function () {
      var prev_data = jsPsych.data.get().last(1).values()[0].response;

      var correct_answer = check3_opts[3];

      if (prev_data.Q0 != correct_answer) {
        return true;
      } else {
        return false;
      }
    },
  };

  var check1_trial = {
    timeline: [
      check1_question,
      check1,
      // confidence_confirmation_correct_fb
    ],
    loop_function: function () {
      var prev_data = jsPsych.data.get().last(1).values()[0].response;

      var correct_answer = check1_opts[1];

      if (prev_data.Q0 != correct_answer) {
        return true;
      } else {
        return false;
      }
    },
  };

  var check2_trial = {
    timeline: [
      check2_question,
      check2,
      // confidence_confirmation_correct_fb
    ],
    loop_function: function () {
      var prev_data = jsPsych.data.get().last(1).values()[0].response;
      var correct_answer = check2_opts[1];

      if (prev_data.Q0 != correct_answer) {
        return true;
      } else {
        return false;
      }
    },
  };

  var check3_trial = {
    timeline: [
      check3_question,
      check3,
      // confidence_confirmation_correct_fb
    ],
    loop_function: function () {
      var prev_data = jsPsych.data.get().last(1).values()[0].response;
      var correct_answer = check3_opts[3];
      if (prev_data.Q0 != correct_answer) {
        return true;
      } else {
        return false;
      }
    },
  };

  function get_n_elapsed_trials() {
    // return number of elapsed trials stored in jsPsych data object
    const n_trials = jsPsych.data.get().select('score').count();
    return n_trials;
  }

  function get_block_score(start_idx, end_idx) {
    // tally up score across a given range of trials and return total
    let all_scores = jsPsych.data.get().select('score').values;
    let block_scores = all_scores.slice(start_idx, end_idx);
    const block_score = block_scores.reduce((sum, score) => sum + score, 0);
    return block_score;
  }

  var practice_instruction = {
    type: jsPsychHtmlbuttonResponse,
    choices: ['Start'],
    stimulus: `<div><img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width: 300px'><h1>Let's practice for a while!</h1>
    <p>You will start by facing one group of zombies.</p>
      </div>`,
  };

  var practice_end = {
    // print scores and end block
    type: Pass,
    on_load: function () {
      // tally up block score
      let n_trials = get_n_elapsed_trials();
      const block_score = get_block_score(block_start_trial, n_trials);
      let possible_block_score = n_trials - block_start_trial;
      // print score in console and to the participant's screen
      console.log('Block score: ' + block_score + '/' + possible_block_score);
      $('#jspsych-html-button-response-stimulus').text(
        'You got ' + block_score + ' / ' + possible_block_score + ' possible points in this block.'
      );
      // update starting index for the next block
      block_start_trial = n_trials;
    },
    choices: ['End Practice'], // SHOULD THIS BE Next? OR DIFFERENT FOR EACH?
  };

  var real_task_welcome = {
    type: jsPsychHtmlbuttonResponse,
    choices: ['Start'],
    stimulus: `<div><img src=${images['zombie.png']} style='top:20%; left: 10% ;height:300px;width: 300px'><h1>Now start protecting your city!</h1>
          <p>There are 5 blocks in the following task. Each block has 200 trials.<br>And there are different groups of zombies in each block.</p></div>`,
  };

  var block_end = {
    // print scores and end block
    type: Pass,
    on_load: function () {
      // tally up block score
      let n_trials = get_n_elapsed_trials();
      const block_score = get_block_score(block_start_trial, n_trials);
      let possible_block_score = n_trials - block_start_trial;
      // print score in console and to the participant's screen
      console.log('Block score: ' + block_score + '/' + possible_block_score);
      $('#jspsych-html-button-response-stimulus').text(
        'You got ' + block_score + ' / ' + possible_block_score + ' possible points in this block.'
      );
      // update starting index for the next block
      block_start_trial = n_trials;
    },
    choices: ['Next Block'],
  };

  // run task!!!
  // welcome + consent
  timeline.push(welcome);
  timeline.push(consent_form);
  timeline.push(age_check);
  timeline.push(fullscreen_trial);

  // instructions + test questions
  timeline.push(instruction);
  timeline.push(check1_trial);
  timeline.push(check2_trial);
  timeline.push(check3_trial);

  // practice block
  timeline.push(practice_instruction);
  practice_block1(timeline, jsPsych);
  timeline.push(practice_end);
  practice_block2(timeline,jsPsych);
  timeline.push(practice_end);

  // real blocks
  timeline.push(real_task_welcome);
  // call blocks in shuffled order
  for (let blk_i = 1; blk_i < block.length; blk_i++) {
    let sync_cp = true;
    switch (block[blk_i]) {
      case 0:
        block1(timeline, jsPsych, sync_cp);
        break;
      case 1:
        block2(timeline, jsPsych, sync_cp);
        break;
      case 2:
        block3(timeline, jsPsych, sync_cp);
        break;
      case 3:
        sync_cp = false;
        block2(timeline, jsPsych, sync_cp);
        break;
      case 4:
        sync_cp = false;
        block3(timeline, jsPsych, sync_cp);
        break;
      default:
        throw new Error('Called a block index that does not exist!');
    }
    timeline.push(block_end);
  }

  // exit fullscreen:
  var fullscreen_trial_exit = {
    type: jsPsychFullscreen,
    fullscreen_mode: false,
  };

  //exit task
  var goodbye = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<div><h1>Thank you for taking the task!</h1><p>Press any key to exit.</p></div>',
    on_finish: function () {
      window.location = 'https://app.prolific.com/submissions/complete?cc=CXXS95SE';
    },
  };

  timeline.push(fullscreen_trial_exit);
  timeline.push(goodbye);

  // jsPsych.init ({
  //     timeline: timeline,
  //     // preload_images: ["../static/images/zombie.png"],
  //     on_finish: function() {
  //         jsPsych.data.get().filter([{trial_type:'practice'},{trial_type: 'click'},{trial_type:'position'}]).localSave('csv','task.csv')
  //       /* psiturk.saveData({
  //             success: function() { psiturk.completeHIT(); }
  //         });

  //       */
  //     },
  //     on_data_update: function(data) {
  //         //psiturk.recordTrialData(data);
  //     },
  //     show_preload_progress_bar: true,
  // })

  return timeline;
}

// Honeycomb, please include these options, and please get the timeline from this function.
export { jsPsychOptions, buildTimeline };
