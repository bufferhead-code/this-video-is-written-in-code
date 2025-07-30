# Untitled Session 22\_mixdown

[00:00:00] When Premiere Pro [00:00:01] crashed three times in [00:00:02] a row during my [00:00:03] last editing session, [00:00:04] I decided it was [00:00:05] finally time for a [00:00:06] change. There [00:00:07] had to be a better way. [00:00:08] Not only do I [00:00:09] wanna get away from this [00:00:10] incredibly [00:00:11] unstable and buggy [00:00:12] software, but more [00:00:13] importantly. I don't wanna [00:00:14] pay [00:00:15] $70 per month for a [00:00:16] bunch of crappy software [00:00:17] as soon as my [00:00:18] student discount [00:00:19] ends.

So I [00:00:20] started to look for [00:00:21] alternatives.

Of course, [00:00:22] there's plenty of [00:00:23] different video editing [00:00:24] tools out there, [00:00:25] but I was always [00:00:26] intrigued by the idea [00:00:27] of [00:00:28] programmatically created [00:00:29] videos. Like any [00:00:30] other programmer, I'm [00:00:31] obsessed with the [00:00:32] idea of automating [00:00:33] things, even if that [00:00:34] means that it will take [00:00:35] much longer than doing [00:00:36] the work [00:00:37] manually. [00:00:38] So [00:00:39] I decided to [00:00:40] create this video that [00:00:41] you're watching right [00:00:42] now completely [00:00:43] with code, [00:00:44] but how does it [00:00:45] work

to find out [00:00:46] I went onto GitHub [00:00:47] and searched for [00:00:48] libraries for creating [00:00:49] videos with code. The [00:00:50] most popular one [00:00:51] is Manim.

It is [00:00:52] a library created [00:00:53] by the popular [00:00:54] YouTuber, three Blue, [00:00:55] one Brown, who [00:00:56] created it to [00:00:57] animate his own YouTube [00:00:58] videos.

It is [00:00:59] therefore made for [00:01:00] creating mathematical [00:01:01] animations. [00:01:02] Manim looks [00:01:03] awesome, and even though I'm [00:01:04] not creating [00:01:05] mathematical videos, I [00:01:06] would've tried it out [00:01:07] immediately if it [00:01:08] wasn't for the fact that it [00:01:09] is written in [00:01:10] Python.

And let's just [00:01:11] say I have a completely [00:01:12] irrational and [00:01:13] unsubstantiated [00:01:14] hate against Python, [00:01:15] and if I had the power to [00:01:16] erase Python from [00:01:17] the history of [00:01:18] humanity, I wouldn't [00:01:19] hesitate for a second. [00:01:20] So in the interest [00:01:21] of my mental health, [00:01:22] I will not use [00:01:23] mem, but I'm [00:01:24] sure it's great if you are [00:01:25] willing to sacrifice [00:01:26] your sanity.

The [00:01:27] second tool I found is [00:01:28] Remotion. It is [00:01:29] based on React and [00:01:30] uses a headless [00:01:31] browser to render the [00:01:32] video, which means [00:01:33] that you can use a lot of [00:01:34] existing [00:01:35] CSS features and [00:01:36] libraries out of the [00:01:37] box.

While it [00:01:38] is possible to make [00:01:39] at least a YouTube [00:01:40] intro with [00:01:41] Remotion, as shown in the [00:01:42] fire video that has told [00:01:43] is video titled [00:01:44] from the Primary [00:01:45] use case is [00:01:46] creating data-driven [00:01:47] videos.

Think, for [00:01:48] example, data [00:01:49] visualization or [00:01:50] animated [00:01:51] statistics. But after [00:01:52] doing some more [00:01:53] research, I found another [00:01:54] tool that looks like a [00:01:55] much better option [00:01:56] for my use [00:01:57] case.

Motion [00:01:58] Canvas is a TypeScript [00:01:59] library for creating [00:02:00] animated [00:02:01] videos. It was created [00:02:02] by a games of [00:02:03] YouTuber called [00:02:04] Artificial who [00:02:05] initially wanted to create [00:02:06] his own YouTube [00:02:07] videos. The main difference [00:02:08] between who Motion [00:02:09] and Motion Canvas [00:02:10] is how the [00:02:11] animation timeline is [00:02:12] controlled

with [00:02:13] Remotion everything [00:02:14] that is happening is [00:02:15] based on the current [00:02:16] frame number that you [00:02:17] can access via the [00:02:18] use current frame [00:02:19] function.

If, for example, [00:02:20] you want to move [00:02:21] an Element to the [00:02:22] right You would just [00:02:23] increase the X [00:02:24] coordinate with the current [00:02:25] frame number. This [00:02:26] works really well, as [00:02:27] long as you know exactly [00:02:28] what is happening at [00:02:29] any given point [00:02:30] in the video. But [00:02:31] as soon as you start to [00:02:32] move stuff around, [00:02:33] it can get [00:02:34] really messy.

[00:02:35] Unfortunately, my [00:02:36] video creation [00:02:37] process is already [00:02:38] quite messy. I [00:02:39] add, we remove and change [00:02:40] stuff all the time while [00:02:41] editing, so [00:02:42] this might not be the [00:02:43] best fit for me.

[00:02:44] Motion Canvas has a [00:02:45] very different [00:02:46] approach. Instead of [00:02:47] calculating everything [00:02:48] based on the frame [00:02:49] number, you can just [00:02:50] write what you want to happen [00:02:51] in sequential [00:02:52] order.

For example, [00:02:53] we can just move an [00:02:54] object to a certain [00:02:55] position, wait for [00:02:56] a second, and then [00:02:57] move it back [00:02:58] afterwards.

It is much [00:02:59] more obvious what is [00:03:00] happening, [00:03:01] especially when we compare it [00:03:02] to a Remotion [00:03:03] component that would do [00:03:04] the same [00:03:05] animation. So I [00:03:06] decided to pass on [00:03:07] Remotion Every [00:03:08] animation that you've seen [00:03:09] so far [00:03:10] and every animation that [00:03:11] you will see late in [00:03:12] this video is [00:03:13] written with motion [00:03:14] canvas. [00:03:15] So how does it [00:03:16] work?

There are five [00:03:17] basic concepts that [00:03:18] Motion Canvas [00:03:19] uses. As soon as you understand [00:03:20] those concepts, you [00:03:21] can do pretty much [00:03:22] anything with motion [00:03:23] canvas.

The [00:03:24] first of them is [00:03:25] scenes. After you [00:03:26] create a new motion [00:03:27] canvas project with an [00:03:28] NPM command, you [00:03:29] will have a new [00:03:30] project with one [00:03:31] scene

, To see what this [00:03:32] scene currently looks [00:03:33] like. You can start [00:03:34] the built-in editor [00:03:35] interface, which acts [00:03:36] more like a preview [00:03:37] with limited editing [00:03:38] capabilities, [00:03:39] but more that [00:03:40] later.

Similar to a DOM [00:03:41] tree, you can now [00:03:42] add node to the [00:03:43] scene and you can [00:03:44] also nest them into [00:03:45] each other.

Just like [00:03:46] in React, you can [00:03:47] use JSX to [00:03:48] make those node [00:03:49] trees a little bit [00:03:50] more readable. But don't [00:03:51] worry. You do [00:03:52] not need any way [00:03:53] knowledge to use [00:03:54] motion Canvas.

[00:03:55] JSX is just [00:03:56] a small abstraction [00:03:57] layer that allows you to [00:03:58] write nodes in an [00:03:59] XML like [00:04:00] syntax, directly in your [00:04:01] JavaScript code.

If you [00:04:02] don't like that, [00:04:03] you can just create [00:04:04] instances of [00:04:05] nodes, nest them into each [00:04:06] other and add them [00:04:07] to the scene.

Talking [00:04:08] about nodes, [00:04:09] there are a ton of [00:04:10] them already [00:04:11] available. Texts, [00:04:12] circles, [00:04:13] rectangles, images, [00:04:14] videos, and [00:04:15] even a ready to use [00:04:16] code component [00:04:17] that you have seen quite a [00:04:18] few times at this [00:04:19] point. And if those are [00:04:20] not enough, you can [00:04:21] easily create your [00:04:22] own notes with [00:04:23] custom looks and [00:04:24] functionality.

You [00:04:25] might or might not have [00:04:26] noticed that this note is [00:04:27] actually centered [00:04:28] in our scene, [00:04:29] That is actually the [00:04:30] default in motion [00:04:31] canvas, but let's [00:04:32] take a closer look [00:04:33] at how positioning [00:04:34] works in motion [00:04:35] canvas.

[00:04:36] origin of a scene is [00:04:37] in the center, [00:04:38] which might be a little [00:04:39] confusing at first, [00:04:40] but it's also very [00:04:41] convenient if you just [00:04:42] want to add a [00:04:43] single element to the [00:04:44] scene.

Other than that, [00:04:45] the position of an [00:04:46] element is always [00:04:47] relative to its [00:04:48] parent, and it uses [00:04:49] a coordinate [00:04:50] system where increasing the [00:04:51] X value will move it [00:04:52] to the right and [00:04:53] increasing the Y [00:04:54] value will move it [00:04:55] down. So it's [00:04:56] similar to CSS and [00:04:57] HTML,

but [00:04:58] don't worry, you [00:04:59] don't have to position [00:05:00] every element [00:05:01] manually.

Even though [00:05:02] Motion Canvas does not [00:05:03] support CSS [00:05:04] directly, it has a [00:05:05] layout feature that [00:05:06] implements a lot of [00:05:07] Flexbox features, [00:05:08] which makes it easy to [00:05:09] position multiple [00:05:10] elements in a scene.

[00:05:11] To create a new [00:05:12] layout root, you can [00:05:13] just set the layout [00:05:14] property on [00:05:15] most of the basic notes [00:05:16] provided. Promotion [00:05:17] canvas.

Those [00:05:18] nodes extend the [00:05:19] Layer Node in the [00:05:20] background.

Similar to [00:05:21] Flexbox, you can [00:05:22] modify the [00:05:23] vertical alignment, the [00:05:24] horizontal [00:05:25] alignment gaps between [00:05:26] the elements and the [00:05:27] direction of the [00:05:28] element flow.

Making [00:05:29] it a powerful tool [00:05:30] that saved me a lot [00:05:31] of effort and time [00:05:32] while creating this [00:05:33] video.

Now that [00:05:34] we have our notes in [00:05:35] our scene and we [00:05:36] know how to position [00:05:37] them, how do we [00:05:38] actually make the move?

[00:05:39] Let's take a look at [00:05:40] how animations [00:05:41] work.

You might [00:05:42] have noticed this [00:05:43] yield keyword in some [00:05:44] of the earlier code [00:05:45] snippets. Motion [00:05:46] canvas uses a [00:05:47] concept called [00:05:48] Generators under the hood, [00:05:49] and I honestly [00:05:50] had no idea [00:05:51] that this exists in [00:05:52] JavaScript.

While [00:05:53] I might be guilty of [00:05:54] having copied and [00:05:55] pasted some code in [00:05:56] other languages [00:05:57] that uses [00:05:58] generators, I never [00:05:59] really cared enough to [00:06:00] understand the concept, [00:06:01] but it's actually [00:06:02] really cool and makes a [00:06:03] lot of sense for something [00:06:04] like video [00:06:05] generation.

So [00:06:06] let's do a quick crash [00:06:07] course just in case you have [00:06:08] the same skill issues [00:06:09] as me.

[00:06:10] Generators are special [00:06:11] functions with a star [00:06:12] behind the function [00:06:13] keyword Inside [00:06:14] of those generator [00:06:15] functions. You can use [00:06:16] the yield keyword, [00:06:17] which acts similar to [00:06:18] a return in the [00:06:19] way that it stops the [00:06:20] function from further [00:06:21] executing and [00:06:22] returns a value.

But [00:06:23] unlike regular [00:06:24] functions, you can [00:06:25] continue the execution [00:06:26] by calling the next [00:06:27] function on the [00:06:28] generator.

For that [00:06:29] reason, they're also [00:06:30] known as lazy [00:06:31] iterators because [00:06:32] once you create an [00:06:33] generator object, [00:06:34] you can call the next [00:06:35] function and it'll [00:06:36] continue the [00:06:37] execution of the [00:06:38] generator until the [00:06:39] next yield [00:06:40] and return the yield [00:06:41] value.

, And you can [00:06:42] also add code between [00:06:43] the yield statements, [00:06:44] which is only [00:06:45] executed when the next [00:06:46] function is [00:06:47] called. Now, motion [00:06:48] canvas uses [00:06:49] yield for every [00:06:50] frame render, [00:06:51] so it'll apply [00:06:52] the changes between [00:06:53] two frames in [00:06:54] between those yield [00:06:55] statements.

That might [00:06:56] sound a little tedious, [00:06:57] but motion [00:06:58] canvas handles all of that [00:06:59] under the hood, [00:07:00] and the functions that [00:07:01] you will use to [00:07:02] animate objects are [00:07:03] actually really [00:07:04] straightforward.

To [00:07:05] move a circle, we can [00:07:06] just write dot [00:07:07] position X [00:07:08] and call it with the [00:07:09] position that we want to [00:07:10] move it to, and the [00:07:11] ovation for the [00:07:12] animation in [00:07:13] seconds.

So this will [00:07:14] move the circle to a [00:07:15] position of [00:07:16] 300 over the span [00:07:17] of one second. As [00:07:18] a third argument, we [00:07:19] can pass an easing [00:07:20] function to make the [00:07:21] animation smooth [00:07:22] a spot.

The [00:07:23] properties that you [00:07:24] are able to animate [00:07:25] will depend on the [00:07:26] note that you're using, [00:07:27] and most of the [00:07:28] properties are [00:07:29] already ready to be [00:07:30] animated, like [00:07:31] position, scale, [00:07:32] rotation, or [00:07:33] even rounded [00:07:34] corners.

if you [00:07:35] want to add your own [00:07:36] animated [00:07:37] attributes, you can do that [00:07:38] as well [00:07:39] using signals.

[00:07:40] All those animations we [00:07:41] looked at so far [00:07:42] use signals under [00:07:43] the hood. It's a way to [00:07:44] tell a note that [00:07:45] something will change [00:07:46] over time. The [00:07:47] exposition of an [00:07:48] element is a [00:07:49] signal just like it's [00:07:50] opacity or [00:07:51] scale,

but you can [00:07:52] also add your own [00:07:53] signals to custom, [00:07:54] no, let's take this [00:07:55] emoji as an [00:07:56] example. We can make a [00:07:57] new custom [00:07:58] node by extending the [00:07:59] motion canvas [00:08:00] node.

Now that we have [00:08:01] our own node, let's [00:08:02] add a new [00:08:03] signal called silliness [00:08:04] and make the length [00:08:05] of the tongue depend [00:08:06] on the silliness [00:08:07] signal.

After adding it [00:08:08] to the scene, we [00:08:09] can animate the [00:08:10] silliness like any [00:08:11] other regular [00:08:12] signal.

When we want to [00:08:13] use signals in the scene [00:08:14] directly instead [00:08:15] of inside of a [00:08:16] custom node, we can do [00:08:17] so by using the [00:08:18] create signal [00:08:19] function.

It'll create a [00:08:20] new signal [00:08:21] object that, for [00:08:22] example, stores the [00:08:23] radius of a [00:08:24] circle.

We can now use the [00:08:25] signal and [00:08:26] calculate the area of [00:08:27] the circle [00:08:28] based on that.

This is [00:08:29] really helpful when [00:08:30] you, for example, want to [00:08:31] show the area of [00:08:32] the circle on the [00:08:33] scene like it is [00:08:34] the case here.

[00:08:35] Changing the signal of the [00:08:36] radios now will [00:08:37] update the area as [00:08:38] well.

When writing [00:08:39] such animations, you [00:08:40] can use wait [00:08:41] four to make the scene [00:08:42] idle for a bit [00:08:43] between the animations [00:08:44] themselves, but [00:08:45] synchronizing audio and [00:08:46] video just by [00:08:47] using animation [00:08:48] durations and [00:08:49] wait four would be [00:08:50] tedious. [00:08:51] So that's why Motion [00:08:52] Canvas has a special [00:08:53] feature for [00:08:54] synchronizing audio [00:08:55] with video, [00:08:56] Arguably the most [00:08:57] unique motion canvas [00:08:58] feature is [00:08:59] time events.

[00:09:00] Instead of using wait [00:09:01] four with a fixed [00:09:02] value in seconds, [00:09:03] you can also [00:09:04] use wait until to [00:09:05] specify a [00:09:06] custom event. This [00:09:07] event then appears in [00:09:08] your motion canvas [00:09:09] editor [00:09:10] automatically and can be moved [00:09:11] around directly in [00:09:12] the editor [00:09:13] interface.

This should [00:09:14] make synchronizing [00:09:15] audio and video a [00:09:16] lot easier. [00:09:17] But the reality [00:09:18] is, as of recording [00:09:19] this voiceover, I [00:09:20] have no idea if [00:09:21] it actually works [00:09:22] well. So let's [00:09:23] ask my future self, [00:09:24] who is editing this [00:09:25] video right now, how it [00:09:26] is going.

Thank you [00:09:27] future self for those [00:09:28] amazing [00:09:29] insights. Now that you [00:09:30] know how to work with [00:09:31] Motion Canvas, what [00:09:32] was the process like [00:09:33] creating this video? [00:09:34] First of all, a [00:09:35] big shout to [00:09:36] artificial the [00:09:37] creator of Motion Canvas, [00:09:38] who did not only do a [00:09:39] great job making [00:09:40] this library [00:09:41] itself, but also [00:09:42] documenting it.

The [00:09:43] documentation has a lot of [00:09:44] examples and is [00:09:45] easy to follow. [00:09:46] Making it a perfect [00:09:47] starting point for [00:09:48] anyone interested in [00:09:49] working with Motion [00:09:50] Canvas.

When I started [00:09:51] out, I was a [00:09:52] little worried about the [00:09:53] performance [00:09:54] aspect, especially for [00:09:55] bigger projects [00:09:56] as motion canvas is [00:09:57] just using an [00:09:58] HTML canvas [00:09:59] and therefore web [00:10:00] technology.

But for [00:10:01] my use case, it [00:10:02] genuinely worked out [00:10:03] pretty well. [00:10:04] Scrubbing through the timeline [00:10:05] is pretty smooth [00:10:06] for the most part. [00:10:07] And overall it [00:10:08] was a much more [00:10:09] responsive [00:10:10] experience than working with [00:10:11] Premier Pro and [00:10:12] After Effects.

So [00:10:13] that's a clear win [00:10:14] for Web Technologies [00:10:15] yet again. [00:10:16] Another advantage [00:10:17] over my previous [00:10:18] workflow is that I [00:10:19] can actually work [00:10:20] on just one [00:10:21] screen with Perme [00:10:22] Pro and After [00:10:23] Effects. I pretty much [00:10:24] always had Perme [00:10:25] Pro on one screen [00:10:26] and after Effects on [00:10:27] the other one, but [00:10:28] with Motion [00:10:29] Canvas a lot of the time.

I [00:10:30] just ended up [00:10:31] opening a preview [00:10:32] browser inside of [00:10:33] Cursor to show the [00:10:34] editor, which worked [00:10:35] surprisingly well [00:10:36] on such a small [00:10:37] preview window.

Because of [00:10:38] the way motion [00:10:39] canvas handles [00:10:40] synchronization between [00:10:41] audio and video, it [00:10:42] also allows me to have a [00:10:43] completely different [00:10:44] workflow. Usually I [00:10:45] have to record the [00:10:46] voiceover before I [00:10:47] start editing the [00:10:48] video. But with [00:10:49] motion canvas, I can [00:10:50] just start [00:10:51] programming my [00:10:52] animations and adopt them as I [00:10:53] go along and do [00:10:54] the voiceover at [00:10:55] the end.

Which is a [00:10:56] real time saver [00:10:57] because more often than [00:10:58] not, I ended up [00:10:59] recording more than [00:11:00] one voiceover [00:11:01] just because I [00:11:02] realized I wanted to change [00:11:03] something during the [00:11:04] editing process.

[00:11:05] It's not [00:11:06] all sunshine and [00:11:07] rainbows. Certain [00:11:08] things take a lot [00:11:09] more time than [00:11:10] just doing them in [00:11:11] traditional editing [00:11:12] software. When re [00:11:13] positioning objects or [00:11:14] zoom animations [00:11:15] can be a [00:11:16] real pain as you [00:11:17] need to change the value [00:11:18] over and over [00:11:19] again until you get it [00:11:20] to the right [00:11:21] position.

The editor [00:11:22] interface does not have [00:11:23] any drag or drop [00:11:24] functionality to [00:11:25] modify the position of [00:11:26] an element which makes [00:11:27] sense as everything [00:11:28] is defined in [00:11:29] code, but it can [00:11:30] still be very [00:11:31] tedious. While the [00:11:32] community is obviously [00:11:33] not as big as [00:11:34] one of Premier Pro [00:11:35] or After Effects, [00:11:36] you can find [00:11:37] components and common [00:11:38] patterns in various git [00:11:39] depositories, [00:11:40] as well as on the [00:11:41] motion canvas discord [00:11:42] server.

I will also [00:11:43] link the source code [00:11:44] of this video in the [00:11:45] description down [00:11:46] below.

If you want to [00:11:47] support my other open [00:11:48] source work, check out [00:11:49] solid time, the open [00:11:50] source time Drager for [00:11:51] your freelancer [00:11:52] agency work at [00:11:53] [00:11:54] solidtime.io

So will I [00:11:55] use Motion Canvas [00:11:56] for my future [00:11:57] videos? Well, I guess [00:11:58] you have to subscribe to [00:11:59] find out.

[00:12:00] Also, if you enjoyed this [00:12:01] video, consider [00:12:02] leaving a like as it really [00:12:03] helps me out. See [00:12:04] you in the next [00:12:05] [00:12:06] video.

