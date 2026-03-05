
-- Thread: How Do I Measure My Trailer Axle? Spring Center & Hub Face G
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'how-to-measure-trailer-axle-spring-center-hub-face') THEN
    RAISE NOTICE 'Skipping: how-to-measure-trailer-axle-spring-center-hub-face (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'How Do I Measure My Trailer Axle? Spring Center & Hub Face Guide',
    'how-to-measure-trailer-axle-spring-center-hub-face',
    'I need to replace my trailer axle but I''m not sure how to get the right measurements. What measurements do I need to provide to order the correct replacement axle?',
    'The most important measurement is spring center to spring center on the same axle. Next, measure hub face to hub face — from the outside of one hub where the studs protrude to the other side. Always double-check your bolt pattern (5, 6, or 8 lug) to ensure the replacement axle fits.',
    '{axle,measurement,how-to}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The most important measurement to get is spring center to spring center on the same axle. Next you can get hub face to hub face measurement. This is the measurement from outside of hub where the studs protrude out from the hub to the other side of the axle where the studs come out from the hub. Always verify your bolt pattern as well.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Can You Use 17.5 Inch Tires and Wheels on 7K Trailer Axles?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'can-you-use-17-5-inch-tires-wheels-on-7k-trailer-axles') THEN
    RAISE NOTICE 'Skipping: can-you-use-17-5-inch-tires-wheels-on-7k-trailer-axles (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Can You Use 17.5 Inch Tires and Wheels on 7K Trailer Axles?',
    'can-you-use-17-5-inch-tires-wheels-on-7k-trailer-axles',
    'I have 7000 lb trailer axles and want to know if I can run 17.5" tires and wheels on them. Is this possible?',
    'Yes, you can use 17.5" wheels and tires with 7K–12K trailer axles. Carter 7K axles use 9/16" studs, allowing both 16" and 17.5" tire/wheel combos. Do not use 17.5" wheels if your axle has 1/2" studs — risk of broken studs under load.',
    '{tires,wheels,7k-axle,17.5-inch}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Short answer is yes. You can definitely use 17.5" wheels and tires with the 7k-12k trailer axles. The Carter 7k axles use a 9/16" stud allowing you to have the option to run both either 16" or 17.5" tire wheel combo. It is not recommended if you have 1/2" studs to use 17.5" wheels however, so always double check that.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Will Carter Trailer Axle Parts Replace Dexter? Interchangeab
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'will-carter-trailer-axle-parts-replace-dexter-interchangeability') THEN
    RAISE NOTICE 'Skipping: will-carter-trailer-axle-parts-replace-dexter-interchangeability (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Will Carter Trailer Axle Parts Replace Dexter? Interchangeability Guide',
    'will-carter-trailer-axle-parts-replace-dexter-interchangeability',
    'I have a Dexter 7K trailer axle. Will the parts interchange with a Rockwell axle or Carter axle?',
    'Yes — for 7K axles and below, all parts (hubs, drums, brakes, bearings, seals) interchange between Dexter, Carter, Rockwell, and Lippert. For 10K and above, parts also interchange as long as bearing sizes and measurements match.',
    '{axle,dexter,carter,compatibility}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Yes, all parts will interchange. Rule of thumb is any trailer axle 7k and below, all parts are the same and will interchange between various brands. For 10k and above, you won''t have any problems mixing Dexter and Lippert components as long as the measurements on the replacement parts are the same — bearing sizes, etc.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Do I Need to Change Wheels When Upgrading from 7K to 8K Trai
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'upgrading-7k-to-8k-trailer-axles-change-wheels') THEN
    RAISE NOTICE 'Skipping: upgrading-7k-to-8k-trailer-axles-change-wheels (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Do I Need to Change Wheels When Upgrading from 7K to 8K Trailer Axles?',
    'upgrading-7k-to-8k-trailer-axles-change-wheels',
    'I want to upgrade my trailer from 7K axles to 8K axles. Do I need to change my wheels and tires too?',
    'No — 7K and 8K axles both use the 8-lug on 6.5" bolt pattern, so you can reuse your 16" or 17.5" wheels. However, check that your tire load rating supports the extra capacity. 10-ply tires (~3,520 lbs each) are too low for 8K — you need at least 14-ply or 17.5" tires.',
    '{axle,upgrade,7k-to-8k,wheels}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'No, the 7k and 8k axles have the same bolt pattern. So you can use both 16" tires and wheels or 17.5" tires and wheels on either trailer axle. However, pay attention to your tire load rating. If your tires can''t handle the weight, upgrading the axle becomes pointless. Your setup is only as strong as your lowest-rated component.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Can I Replace a Square Trailer Axle with a Round Axle?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'replace-square-trailer-axle-with-round-axle') THEN
    RAISE NOTICE 'Skipping: replace-square-trailer-axle-with-round-axle (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Can I Replace a Square Trailer Axle with a Round Axle?',
    'replace-square-trailer-axle-with-round-axle',
    'I need to replace my boat trailer axle but it''s a square axle. You don''t seem to have square axles. What do I do?',
    'Yes — you can use a round axle in place of a square axle with no issues. Simply purchase a U-bolt kit for the round axle diameter (e.g., 2-3/8" for 3.5K). Make sure the spring center measurement matches your existing axle.',
    '{axle,boat-trailer,square-to-round}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'You can use a round axle in place of a square axle no problem. You would just need to buy a U-bolt kit for the round trailer axle and then you will be good to go. Be sure to double check your spring center measurements on your current axle to make sure they are the same.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: What Size Trailer Axle Do I Need for a Car Hauler?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'what-size-trailer-axle-for-car-hauler') THEN
    RAISE NOTICE 'Skipping: what-size-trailer-axle-for-car-hauler (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'What Size Trailer Axle Do I Need for a Car Hauler?',
    'what-size-trailer-axle-for-car-hauler',
    'I want to build a car hauler trailer. What width of trailer frame would I need and what axles?',
    'An 82" wide frame is typical for a car hauler. Most builders use 3.5K to 8K axles. For 3.5K–7K axles, a 95" hub face with 80" spring center is standard. For 8K axles, use a 97" hub face with 80" spring center — these are the widest road-legal options.',
    '{axle,car-hauler,build}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, '82" wide frame is typical for a car hauler trailer. People put anything from 3.5k axles to 8k axles on car haulers. The 95" hub face 80" spring center is typically what people use for 3.5k - 7k axles and on a 8k axle they will use a 97" hub face with 80" spring center. These are the widest road legal axles you can use for your car hauler trailers.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: How to Know If Trailer Brake Axle Is Installed Correctly
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'how-to-know-trailer-brake-axle-installed-correctly') THEN
    RAISE NOTICE 'Skipping: how-to-know-trailer-brake-axle-installed-correctly (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'How to Know If Trailer Brake Axle Is Installed Correctly',
    'how-to-know-trailer-brake-axle-installed-correctly',
    'How do I know if I installed my trailer brake axle the right way so the brakes are not backwards?',
    'Make sure the wires coming out of the brake axle face toward the rear of the trailer. Some backing plates have L/R stickers — left is driver side, right is passenger side (like sitting in your truck). If no stickers, wires facing rearward confirms correct orientation.',
    '{brakes,installation,how-to}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The easiest way to know you installed your trailer brake axle correctly is to make sure that the wires coming out of the brake axle are facing towards the back of the trailer. Additionally at times, there will be little stickers on the backing plates that say left and right. The left side is the driver side and the right side is the passenger side.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: What Does 'Spring Pads Loose' Mean When Ordering a Trailer A
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'spring-pads-loose-meaning-trailer-axle-ordering') THEN
    RAISE NOTICE 'Skipping: spring-pads-loose-meaning-trailer-axle-ordering (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'What Does ''Spring Pads Loose'' Mean When Ordering a Trailer Axle?',
    'spring-pads-loose-meaning-trailer-axle-ordering',
    'When looking at your axle options I see some have ''pads loose'' for the spring center. What does this mean?',
    'Spring pads loose means the rectangular mounting pads are not welded to the axle beam — they ship separately so you can weld them at the exact position your trailer requires. This is ideal for uncommon trailer widths where pre-welded pad positions don''t match your hangers.',
    '{axle,spring-pads,ordering}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'The spring pads come loose so you can weld them where you want, or we can also weld them where you want for an extra charge. When the spring pads are pre-welded in place then they are for exactly that width of trailer. However if you have an uncommon trailer width, pads loose might be the best option for you. It provides more flexibility so you can weld the spring pads where you need them.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: What Is a Cambered Trailer Axle? Why Is My Axle Bent in the 
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'what-is-cambered-trailer-axle-bent-center') THEN
    RAISE NOTICE 'Skipping: what-is-cambered-trailer-axle-bent-center (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'What Is a Cambered Trailer Axle? Why Is My Axle Bent in the Center?',
    'what-is-cambered-trailer-axle-bent-center',
    'The axle arrived and I installed it but it comes bent in the center. I don''t know if that''s normal but there is a rim that doesn''t look very straight.',
    'That bend is called camber — it''s intentional. A cambered axle is designed to flatten under load, distributing weight evenly across the tires. This extends tire life compared to a straight axle, which would bow downward under weight and cause uneven wear.',
    '{axle,camber,troubleshooting}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'That is called a camber. It makes it where the tires will last longer vs a straight axle. Under load the axle straightens out, distributing the weight evenly.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Trailer Vibrating at 55 MPH: Diagnosis and Fix Guide
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'trailer-vibrating-shaking-55-mph-diagnosis-fix') THEN
    RAISE NOTICE 'Skipping: trailer-vibrating-shaking-55-mph-diagnosis-fix (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Trailer Vibrating at 55 MPH: Diagnosis and Fix Guide',
    'trailer-vibrating-shaking-55-mph-diagnosis-fix',
    'My trailer is shaking and vibrating at around 55 MPH. What could be causing this?',
    'In 80%+ of cases, trailer vibration at highway speed is caused by tire/wheel balance issues or worn bearings. Check tire pressure and condition first, then feel the hubs after a drive — hot hubs mean bearing problems. Also inspect for bent axles, loose U-bolts, and worn spring bushings.',
    '{troubleshooting,vibration,tires,bearings}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'If your trailer is shaking or vibrating at around 55 MPH, the most common reasons are: 1) Tire/wheel balance issues or flat spots from sitting too long. 2) Bad or worn tires with separated belts. 3) Hub or bearing problems causing looseness. 4) Bent axle or loose U-bolts. 5) Worn leaf spring bushings or shackles. 6) Improper load distribution. In 80%+ of cases, it''s bad tires, bad balance, or loose hub.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Oil Bath vs Grease Trailer Hubs: Which Is Better?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'oil-bath-vs-grease-trailer-hubs-which-is-better') THEN
    RAISE NOTICE 'Skipping: oil-bath-vs-grease-trailer-hubs-which-is-better (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Oil Bath vs Grease Trailer Hubs: Which Is Better?',
    'oil-bath-vs-grease-trailer-hubs-which-is-better',
    'I''m ordering new axles and can''t decide between oil bath and EZ-lube grease hubs. What are the pros and cons?',
    'Oil bath hubs are better for highway and heavy-duty use — oil dissipates heat more effectively and requires less frequent service. Grease (EZ-lube) hubs are simpler and work well for lighter or infrequent use. To switch from oil to grease on 10K–12K axles, simply drain the oil and pack with grease — the seal is the same.',
    '{hubs,oil-bath,grease,maintenance}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Oil bath hubs are great especially for highway speeds. If your trailers see a lot of highway mileage, oil bath is ideal. For switching from oil to grease on 10K and 12K axles, simply drain the oil and pack with grease. The seal is the same. Easy and simple.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: How to Wire Trailer Brake Axle: No Polarity Needed
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'how-to-wire-trailer-brake-axle-electric-brakes') THEN
    RAISE NOTICE 'Skipping: how-to-wire-trailer-brake-axle-electric-brakes (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'How to Wire Trailer Brake Axle: No Polarity Needed',
    'how-to-wire-trailer-brake-axle-electric-brakes',
    'I bought a new trailer brake axle. How do I hook up the wires for the electric brakes?',
    'There is no polarity on trailer electric brake wires — connect either wire to hot or ground. Just make sure the wires coming out of the axle face toward the rear of the trailer to confirm correct axle installation.',
    '{brakes,wiring,installation,how-to}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'There is no polarity in the wires, so you can connect either wire to hot or ground. Ensure the wires coming out of the axle are positioned facing towards the rear to confirm that the axle is installed correctly.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Can I Move Spring Pad Seats That Are Welded on the Axle?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'move-spring-pad-seats-welded-on-trailer-axle') THEN
    RAISE NOTICE 'Skipping: move-spring-pad-seats-welded-on-trailer-axle (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Can I Move Spring Pad Seats That Are Welded on the Axle?',
    'move-spring-pad-seats-welded-on-trailer-axle',
    'Can I move the spring pad seats that are welded on the axle to where I need them?',
    'Yes — you can cut and re-weld spring pads to a different position on the axle beam. TPU offers this service for $100 per axle. Alternatively, order axles with spring pads loose and weld them at the exact spring center your trailer requires.',
    '{axle,spring-pads,custom}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Yes you can. We do this all the time for customers. If you prefer us to move the spring seats where you need on the axles, we charge $100 per axle to do so. Or you can buy the axle with spring pads loose and weld them where you need.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: What Is the Difference Between Over-Slung and Under-Slung Tr
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'over-slung-vs-under-slung-trailer-axle-difference') THEN
    RAISE NOTICE 'Skipping: over-slung-vs-under-slung-trailer-axle-difference (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'What Is the Difference Between Over-Slung and Under-Slung Trailer Axles?',
    'over-slung-vs-under-slung-trailer-axle-difference',
    'What is a over slung trailer axle? What''s the difference between over-slung and under-slung?',
    'Over-slung means the leaf springs sit on top of the axle beam — this is the most common configuration. Under-slung means the springs are mounted underneath the axle, which lowers the trailer''s ride height. Choose under-slung when you need a lower deck height.',
    '{axle,suspension,over-slung,under-slung}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'An over-slung trailer axle means the springs are over the axle. Under-slung trailer axles would be where the springs are under the axle. Over-slung is the most common configuration.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: How Far Should Spring Pads Be from the Hub on a Trailer Axle
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'spring-pad-distance-from-hub-trailer-axle') THEN
    RAISE NOTICE 'Skipping: spring-pad-distance-from-hub-trailer-axle (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'How Far Should Spring Pads Be from the Hub on a Trailer Axle?',
    'spring-pad-distance-from-hub-trailer-axle',
    'I purchased a 95" hub face axle and want to weld the spring pads to 74" spring center. Would that hurt anything?',
    'Yes — placing spring pads too far from the hubs de-rates the axle significantly. The manufacturer guideline is no less than 11 inches and no more than 18 inches from the hub. For a 74" spring center, use an 89" hub face axle instead to stay within safe limits.',
    '{axle,spring-pads,safety,de-rating}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Yes this would de-rate your axle a lot. If you need your spring centers to be close to 74 inches then I would recommend going with an 89 inch hub face axle so your axle wouldn''t be de-rated. Based on the manufacturer''s guidelines, the springs should be placed no less than 11 inches and no more than 18 inches from the hub.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Dexter 8-285 Hub Drum Replacement: Cross Reference & Carter 
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'dexter-8-285-hub-drum-replacement-cross-reference') THEN
    RAISE NOTICE 'Skipping: dexter-8-285-hub-drum-replacement-cross-reference (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Dexter 8-285 Hub Drum Replacement: Cross Reference & Carter Equivalent',
    'dexter-8-285-hub-drum-replacement-cross-reference',
    'I''m looking for a replacement for a Dexter 8-285 hub drum. Do you have an interchangeable part?',
    'The Dexter 8-285 is an 8K hub and drum with 12-1/4" x 3-3/8" brakes, 5/8" studs, and 8x6.5" bolt pattern. The Carter equivalent (BD-8K058) is a direct replacement with the advantage of a screw-in oil cap that supports both oil and grease lubrication.',
    '{hub-drum,dexter,cross-reference,8k}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Yes that is a Dexter 8K hub and drum that uses 12-1/4" x 3-3/8" brakes. It has 5/8" studs and grease. We have this in the Carter brand that fully interchanges with this hub and drum. The only difference is that it uses a screw-in oil cap instead of a press-in grease cap. This allows you to have both options to either use oil lubrication or grease.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: What Size Trailer Axle for a 5x8 Utility Trailer?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'what-size-trailer-axle-for-5x8-utility-trailer') THEN
    RAISE NOTICE 'Skipping: what-size-trailer-axle-for-5x8-utility-trailer (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'What Size Trailer Axle for a 5x8 Utility Trailer?',
    'what-size-trailer-axle-for-5x8-utility-trailer',
    'What size axle do I need for a 5'' x 8'' trailer?',
    'A 5x8 utility trailer typically uses a 3,500 lb axle with a 73" hub face and 58" spring center, with a 5-lug bolt pattern. Always measure your existing spring center and bolt pattern to confirm before ordering a replacement.',
    '{axle,utility-trailer,sizing}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'Without knowing your exact measurements I can only take a knowledgeable guess and say you would have a 3500 lb trailer axle with a 73" hub face / 58" spring center axle. Remember this is just a guess, always double check your spring center to spring center measurement and bolt pattern if it''s a 5 lug to ensure the replacement trailer axle will fit.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Can I Use a VIN Number to Find What Size Trailer Axle I Need
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'can-vin-number-find-trailer-axle-size') THEN
    RAISE NOTICE 'Skipping: can-vin-number-find-trailer-axle-size (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Can I Use a VIN Number to Find What Size Trailer Axle I Need?',
    'can-vin-number-find-trailer-axle-size',
    'Can I give you my VIN number from my trailer so you know what size axle I need?',
    'No — there is no trailer VIN lookup tool that provides axle specifications. You will need to physically measure your axle: spring center to spring center and hub face to hub face. The axle tag (if present) on the center of the tube will also have key specifications.',
    '{axle,measurement,vin}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'No sir, there is no trailer VIN lookup software that provides that information. We will need you to measure your axle. Get the spring center to spring center measurement and hub face to hub face measurement.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: What Is the Bolt Pattern on 14 Inch Trailer Tires and Wheels
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'bolt-pattern-14-inch-trailer-tires-wheels') THEN
    RAISE NOTICE 'Skipping: bolt-pattern-14-inch-trailer-tires-wheels (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'What Is the Bolt Pattern on 14 Inch Trailer Tires and Wheels?',
    'bolt-pattern-14-inch-trailer-tires-wheels',
    'I don''t know what bolt pattern I have but I do have a 14" trailer tire and wheel. How do I figure it out?',
    '14" trailer tires and wheels almost always use a 5 on 4.5" bolt pattern. The only common size with multiple bolt pattern options is 15" — those can be 5x4.5", 5x4.75", 5x5", or 6x5.5". For 13" and smaller, it''s typically 4x4" or 5x4.5".',
    '{wheels,bolt-pattern,14-inch,sizing}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'If you have a 14" trailer tire and rim then it''s going to be a 5 on 4.5" bolt pattern. Really, the only size tire wheel that has 4 different bolt patterns are 15" trailer tire and wheels. However I do come across a few random bolt patterns that are not 15" that do have something other than a 5x4.5" bolt pattern, so it''s always best to check.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;


-- Thread: Will an ST225/75R15 Tire Work in Place of a 235/75R15?
DO $$
DECLARE
  _tid uuid;
  _cid uuid;
BEGIN
  -- Skip if slug already exists
  IF EXISTS (SELECT 1 FROM threads WHERE slug = 'st225-75r15-vs-235-75r15-trailer-tire-interchange') THEN
    RAISE NOTICE 'Skipping: st225-75r15-vs-235-75r15-trailer-tire-interchange (already exists)';
    RETURN;
  END IF;

  INSERT INTO threads (title, slug, body, summary, tags, user_id, score, comment_count)
  VALUES (
    'Will an ST225/75R15 Tire Work in Place of a 235/75R15?',
    'st225-75r15-vs-235-75r15-trailer-tire-interchange',
    'Will an ST225/75R15 work in place of a 235/75R15 trailer tire?',
    'Yes — an ST225/75R15 can replace a 235/75R15. The 235 is 10mm wider and marginally taller, but both fit the same 15" rim. Check that the narrower tire fits your wheel well without rubbing, and verify the load rating meets your weight requirements. ST-rated trailer tires typically have higher load capacity than similarly sized LT tires.',
    '{tires,sizing,comparison,15-inch}',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    0,
    1
  )
  RETURNING id INTO _tid;

  -- Insert accepted answer
  INSERT INTO comments (thread_id, body, user_id, score)
  VALUES (_tid, 'YES, an ST225/75R15 tire can often work in place of a 235/75R15 tire. The 235/75R15 tire is 10 millimeters wider than the ST225/75R15 tire. Since both tires have the same aspect ratio and rim diameter, their overall diameters will be slightly different. Make sure the tire can fit without rubbing and check the load capacity ratings.', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 0)
  RETURNING id INTO _cid;

  UPDATE threads SET accepted_comment_id = _cid WHERE id = _tid;
END;
$$;

